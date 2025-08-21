import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useState } from 'react';
import cookie from 'js-cookie';
import { graphql, useFragment } from 'react-relay';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search'; // Import the magnifying glass icon
import InputAdornment from '@mui/material/InputAdornment';

// Project navigation components for left sidebar
const StyledProjectNavigation = styled.div`
  width: 100%;
  margin-bottom: 16px;
  z-index: 10;
`;

const StyledAutocomplete = styled(Autocomplete)`
  width: 100%;
  margin-bottom: 12px;
`;

const StyledNavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
`;

const StyledNavButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: rgba(52, 95, 169, 0.1);
  }
`;

const CBC_LINK = '/analyst/cbc';
const APPLICATION_LINK = '/application';

const ProjectNavigationSidebar = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ProjectNavigationSidebar_query on Query {
        allCcbcApplicationData: allApplications(
          first: 1000
          filter: { archivedAt: { isNull: true } }
          orderBy: CCBC_NUMBER_ASC
        ) {
          nodes {
            ccbcNumber
            rowId
            program
          }
        }
        allCbcData(
          filter: { archivedAt: { isNull: true } }
          orderBy: PROJECT_NUMBER_ASC
        ) {
          edges {
            node {
              projectNumber
              cbcId
            }
          }
        }
      }
    `,
    query
  );

  const router = useRouter();
  const { asPath } = router;
  const applicationId = (
    router.query.applicationId || router.query.cbcId
  )?.toString();
  const applicationType = asPath.includes(CBC_LINK) ? 'CBC' : 'CCBC';
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('dashboard_row_model'));
    if (!data) {
      const { allCcbcApplicationData, allCbcData } = queryFragment;
      const applications = allCcbcApplicationData?.nodes?.map((item) => {
        return {
          description: item.ccbcNumber,
          id: item.rowId,
          type: 'CCBC',
        };
      });
      const cbcData = allCbcData?.edges?.map((item) => {
        return {
          description: item.node.projectNumber,
          id: item.node.cbcId,
          type: 'CBC',
        };
      });
      setOptions([...applications, ...cbcData]);
    } else {
      setOptions(
        data?.map((item) => {
          return {
            description: item.projectId || item.ccbcNumber,
            id: item.rowId || item.applicationId,
            type: item.program === 'OTHER' ? 'CCBC' : item.program || 'CCBC',
          };
        })
      );
    }
  }, [queryFragment]);

  const currentIndex = useMemo(() => {
    return options.findIndex(
      (option) =>
        option.id?.toString() === applicationId &&
        option.type === applicationType
    );
  }, [applicationId, options, applicationType]);

  const nextOption = useMemo(() => {
    return options[currentIndex + 1];
  }, [currentIndex, options]);

  const prevOption = useMemo(() => {
    return options[currentIndex - 1];
  }, [currentIndex, options]);

  const lastVisited =
    JSON.parse(cookie.get('project_nav_last_visited') || '{}') || {};

  const processCurrentNode = () => {
    const currentNode =
      currentIndex > -1
        ? options[currentIndex]
        : {
            type: applicationType,
            id: applicationId,
          };
    const newLastVisited = {
      ...lastVisited,
      [currentNode.type]: asPath,
    };
    cookie.set('project_nav_last_visited', JSON.stringify(newLastVisited));
    return currentNode;
  };

  const replacePath = (type, path, id) => {
    if (type === 'CBC') {
      return path.replace(/\/analyst\/cbc\/\d+/, `${CBC_LINK}/${id}`);
    }
    return path.replace(/\/application\/\d+/, `${APPLICATION_LINK}/${id}`);
  };

  const handleNavigation = (nextNode) => {
    const currentNode = processCurrentNode();
    const id = nextNode?.id;
    let newPath: string;

    // switching between cbc and ccbc application types
    if (nextNode?.type !== currentNode?.type) {
      if (lastVisited[nextNode.type]) {
        newPath = replacePath(nextNode.type, lastVisited[nextNode.type], id);
      } else if (!asPath.includes('/history')) {
        newPath =
          nextNode?.type === 'CBC'
            ? `${CBC_LINK}/${id}`
            : `analyst${APPLICATION_LINK}/${id}/summary`;
      } else {
        newPath =
          nextNode?.type === 'CBC'
            ? `${CBC_LINK}/${id}/cbcHistory`
            : `analyst${APPLICATION_LINK}/${id}/history`;
      }
    } else {
      newPath = replacePath(nextNode.type, asPath, id);
    }
    // Use shallow routing to avoid full page reload and preserve scroll position
    router.push(newPath, undefined, { shallow: true });
  };

  return (
    <StyledProjectNavigation>
      <div data-skip-unsaved-warning>
        <StyledAutocomplete
          size="small"
          key="project-nav-option-autocomplete"
          data-testid="project-nav-option-autocomplete"
          onChange={(_e, val) => {
            if (val) handleNavigation(val);
          }}
          options={options}
          getOptionLabel={(option: any) => option.description?.toString()}
          getOptionDisabled={(option: any) =>
            option.id?.toString() === applicationId &&
            option.type === applicationType
          }
          renderInput={(params) => (
            <TextField
              {...params}
              data-testid="project-nav-option-textfield"
              label="Go to project"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
      <StyledNavigationButtons>
        <StyledNavButton
          type="button"
          onClick={() => {
            handleNavigation(prevOption);
          }}
          disabled={!prevOption}
          data-testid="project-nav-prev-icon"
          data-skip-unsaved-warning
          title={
            prevOption
              ? `Previous: ${prevOption?.description}`
              : 'No previous project'
          }
        >
          <FontAwesomeIcon
            icon={faCircleArrowLeft}
            fixedWidth
            size="lg"
            color={prevOption ? '#345FA9' : '#A9A9A9'}
          />
        </StyledNavButton>
        <StyledNavButton
          type="button"
          onClick={() => {
            handleNavigation(nextOption);
          }}
          disabled={!nextOption}
          data-testid="project-nav-next-icon"
          data-skip-unsaved-warning
          title={
            nextOption ? `Next: ${nextOption?.description}` : 'No next project'
          }
        >
          <FontAwesomeIcon
            icon={faCircleArrowRight}
            fixedWidth
            size="lg"
            color={nextOption ? '#345FA9' : '#A9A9A9'}
          />
        </StyledNavButton>
      </StyledNavigationButtons>
    </StyledProjectNavigation>
  );
};

export default ProjectNavigationSidebar;

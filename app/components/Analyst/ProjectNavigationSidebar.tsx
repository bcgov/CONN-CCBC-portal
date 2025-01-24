import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useState } from 'react';
import { Url } from 'node_modules/next/dist/shared/lib/router/router';
import cookie from 'js-cookie';
import { graphql, useFragment } from 'react-relay';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search'; // Import the magnifying glass icon
import InputAdornment from '@mui/material/InputAdornment';

const StyledAside = styled.aside`
  margin-top: 250px;
  min-height: 100%;
  width: ${(props) => `calc((100vw - ${props.theme.width.pageMaxWidth}) / 2)`};
`;

const StyledNav = styled.nav`
  width: 100%;
  position: sticky;
  top: 100px;
  max-width: 300px;
`;

const StyledLowerSection = styled.section`
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
`;

const StyledAutocomplete = styled(Autocomplete)`
  width: 100%;
`;

const StyledNavButton = styled.button`
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const CBC_LINK = '/analyst/cbc';
const APPLICATION_LINK = '/application';

const ProjectNavigationSidebar = ({ query }) => {
  const queryFragment = useFragment(
    graphql`
      fragment ProjectNavigationSidebar_query on Query {
        allApplications {
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
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('allDashboard_row_model'));
    if (!data) {
      const { allApplications, allCbcData } = queryFragment;
      const applications = allApplications?.nodes?.map((item) => {
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
  const nextOption = useMemo(() => {
    const currentIndex = options.findIndex(
      (option) => option.id?.toString() === applicationId
    );
    return options[currentIndex + 1];
  }, [applicationId, options]);

  const prevOption = useMemo(() => {
    const currentIndex = options.findIndex(
      (option) => option.id?.toString() === applicationId
    );
    return options[currentIndex - 1];
  }, [applicationId, options]);

  const lastVisited =
    JSON.parse(cookie.get('project_nav_last_visited') || '{}') || {};

  const processCurrentNode = () => {
    const currentNode = options.find(
      (option) => option.id?.toString() === applicationId
    );
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
    let newPath: Url;

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
    router.push(newPath);
  };

  return (
    <StyledAside>
      <StyledNav>
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
            option.id?.toString() === applicationId
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
        <StyledLowerSection>
          <StyledNavButton
            type="button"
            onClick={() => {
              handleNavigation(prevOption);
            }}
            disabled={!prevOption}
            data-testid="project-nav-prev-icon"
          >
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              fixedWidth
              size="lg"
              color={prevOption ? '#345FA9' : '#A9A9A9'}
            />
            {prevOption && (
              <span style={{ fontSize: '12px' }}>
                Previous project - {prevOption?.description}
              </span>
            )}
          </StyledNavButton>
          <StyledNavButton
            type="button"
            onClick={() => {
              handleNavigation(nextOption);
            }}
            disabled={!nextOption}
            data-testid="project-nav-next-icon"
          >
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              fixedWidth
              size="lg"
              color={nextOption ? '#345FA9' : '#A9A9A9'}
            />
            {nextOption && (
              <span style={{ fontSize: '12px' }}>
                Next project - {nextOption?.description}
              </span>
            )}
          </StyledNavButton>
        </StyledLowerSection>
      </StyledNav>
    </StyledAside>
  );
};

export default ProjectNavigationSidebar;

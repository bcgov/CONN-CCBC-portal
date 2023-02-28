import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql } from 'react-relay';
import { DashboardTabs } from 'components/AnalystDashboard';
import AdminTabs from 'components/Admin/AdminTabs';
import styled from 'styled-components';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { Layout } from 'components';
import { demoHistoryQuery } from '__generated__/demoHistoryQuery.graphql';

const getHistoryQuery = graphql`
  query demoHistoryQuery($byRecordId: JSONFilter, $byApplicationId: JSONFilter) {
    session {
      sub
      ...DashboardTabs_query
    }
    application:allRecordVersions(
      condition: {tableName: "application", op: INSERT}
      filter: {record: $byRecordId}
    ) {
      nodes {
        op
        tableName
        record
        createdBy
        createdAt
        recordId
        ccbcUserByCreatedBy {
          familyName
          givenName
          sessionSub
        }
      }
    }
    status:  allRecordVersions(
      condition: {tableName: "application_status", op: INSERT}
      filter: {record: $byApplicationId}
    ) {
      nodes {
        op
        tableName
        record
        createdBy
        createdAt
        recordId
        ccbcUserByCreatedBy {
          familyName
          givenName
          sessionSub
        }
      }
    }
    assessment:  allRecordVersions(
      condition: {tableName: "assessment_data", op: INSERT}
      filter: {record: $byApplicationId}
    ) {
      nodes {
        op
        tableName
        record
        createdBy
        createdAt
        recordId
        ccbcUserByCreatedBy {
          familyName
          givenName
          sessionSub
        }
      }
    }
    attachment:allRecordVersions(
      condition: {tableName: "attachment", op: INSERT}
      filter: {record: $byApplicationId}
    ) {
      nodes {
        op
        tableName
        record
        createdBy
        createdAt
        recordId
        ccbcUserByCreatedBy {
          familyName
          givenName
          sessionSub
        }
      }
    }
  }
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const DemoHistoryTab = (list) =>{
  return (
    <div>
      {list && Object.keys(list).map((x)=>{
        return (
          <div>
            {list[x].message}
          </div>
        )
      })}
    </div>);
}

const transformData = (historyData) => {
  const timeline = [];
  const {application, attachment, status} = historyData;
  application?.nodes?.forEach(x=> {
    const timestamp = x.createdAt.substring(0,16).replace('T',' ');
    timeline.push({timestamp, 
      actor: 'customer', type:'application',
      message: `${timestamp} - Customer created application`
  });
  });  
  attachment?.nodes?.forEach(x=> {
    const timestamp = x.createdAt.substring(0,16).replace('T',' ');
    if (x.ccbcUserByCreatedBy.sessionSub.indexOf('bceid') > -1) {
      timeline.push({timestamp, 
        actor: 'customer', type:'attachment',
        message: `${timestamp} - Customer uploaded attachment ${x.record.file_name}`});
    }
    else {
      const actor=`${x.ccbcUserByCreatedBy.sessionSub.familyName}, ${x.ccbcUserByCreatedBy.sessionSub.givenName}`;
      timeline.push({timestamp, actor, type:'attachment',
        message: `${timestamp} - ${actor} uploaded attachment ${x.record.file_name}`});
    }
  });
  status?.nodes?.forEach(x=> {    
    const timestamp = x.createdAt.substring(0,16).replace('T',' ');
    if (x.ccbcUserByCreatedBy.sessionSub.indexOf('bceid') > -1) {
      timeline.push({timestamp, actor: 'customer', type:'status',
      message: `${timestamp} - Customer changed application status to ${x.record.status}`});
    }
    else {
      const actor=`${x.ccbcUserByCreatedBy.sessionSub.familyName}, ${x.ccbcUserByCreatedBy.sessionSub.givenName}`;
      timeline.push({timestamp, actor, type:'status',
      message: `${timestamp} - ${actor} changed application status to ${x.record.status}`});
    }
  });
  
  assessment?.nodes?.forEach(x=> {    
    const timestamp = x.createdAt.substring(0,16).replace('T',' ');
    if (x.ccbcUserByCreatedBy.sessionSub.indexOf('bceid') > -1) {
      timeline.push({timestamp, actor: 'customer', type:'status',
      message: `${timestamp} - Customer added assessment. Type: ${x.record.assessment_data_type}`});
    }
    else {
      const actor=`${x.ccbcUserByCreatedBy.sessionSub.familyName}, ${x.ccbcUserByCreatedBy.sessionSub.givenName}`;
      timeline.push({timestamp, actor, type:'status',
      message: `${timestamp} - ${actor} added assessment. Type: ${x.record.assessment_data_type}`});
    }
  });
  return timeline.sort((a,b)=>b.timestamp-a.timestamp);
}
const DemoHistory = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, demoHistoryQuery>) => {
  const query = usePreloadedQuery(getHistoryQuery, preloadedQuery);
  const { session } = query;
  const formatted = transformData(query);
  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledContainer>
        <DashboardTabs session={session} />
        <AdminTabs />
        <DemoHistoryTab {...formatted}/>
      </StyledContainer>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: () => {
    return {
      "byRecordId":{"contains":{"id":3}},
      "byApplicationId":{"contains":{"application_id":11}}
    };
  },
};

export default withRelay(
  DemoHistory,
  getHistoryQuery,
  withRelayOptions
);

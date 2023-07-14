import { WidgetProps } from '@rjsf/utils';
import DownloadLink from 'components/DownloadLink';
import React, { useMemo } from 'react';

const FileWidget: React.FC<WidgetProps> = ({ value }) => {
  const filesArray = useMemo(() => {
    return value || [];
  }, [value]);

  return filesArray?.map((el, index) => (
    <React.Fragment key={el.name}>
      <DownloadLink uuid={el.uuid} fileName={el.name ?? el.toString()} />
      {index < filesArray.length - 1 && (
        <>
          ,<br />
        </>
      )}
    </React.Fragment>
  ));
};

export default FileWidget;

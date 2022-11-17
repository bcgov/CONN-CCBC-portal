import { WidgetProps } from '@rjsf/core';
import React, { useMemo } from 'react';

const FileWidget: React.FC<WidgetProps> = ({ value }) => {
  const filesArray = useMemo(() => {
    return value || [];
  }, [value]);

  return filesArray?.map((el, index) => (
    <React.Fragment key={el.name}>
      {el.name ?? el.toString()}
      {index < filesArray.length - 1 && (
        <>
          ,<br />
        </>
      )}
    </React.Fragment>
  ));
};

export default FileWidget;

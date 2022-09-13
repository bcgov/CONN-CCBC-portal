import { WidgetProps } from '@rjsf/core';
import React, { useMemo } from 'react';

const FileWidget: React.FC<WidgetProps> = ({ id, value }) => {
  const filesArray = useMemo(() => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }, [value]);

  return filesArray?.map((el, index) => (
    <React.Fragment key={`${id}_${index}`}>
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

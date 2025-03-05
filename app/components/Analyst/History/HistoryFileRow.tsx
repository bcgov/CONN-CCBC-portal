import DownloadLink from 'components/DownloadLink';
import React from 'react';

const HistoryFileRow = ({ file, filesDiff }) => {
  // A file was added
  if (file[0] === '+') {
    return (
      <div key={file[1].uuid}>
        Added file <DownloadLink uuid={file[1].uuid} fileName={file[1].name} />
      </div>
    );
  }
  // A file was removed
  if (file[0] === '-') {
    return (
      <div key={file[1].uuid}>
        Deleted file{' '}
        <del>
          <DownloadLink uuid={file[1].uuid} fileName={file[1].name} />
        </del>
      </div>
    );
  }
  // The object was modified (file replacement)
  if (file[0] === '~') {
    if (filesDiff.length === 1) {
      return (
        <div key={file[1].uuid}>
          Replaced file{' '}
          <del>
            <DownloadLink
              uuid={file[1].uuid.__old}
              fileName={file[1].name.__old || file[1].name}
            />
          </del>{' '}
          with file{' '}
          <DownloadLink
            uuid={file[1].uuid.__new}
            fileName={file[1].name.__new || file[1].name}
          />
        </div>
      );
    }
    return (
      <>
        <div key={file[1].uuid}>
          Deleted file{' '}
          <del>
            <DownloadLink
              uuid={file[1].uuid.__old}
              fileName={file[1].name.__old}
            />
          </del>{' '}
        </div>
        <div key={file[1].uuid}>
          Added file{' '}
          <DownloadLink
            uuid={file[1].uuid.__new}
            fileName={file[1].name.__new}
          />{' '}
        </div>
      </>
    );
  }
  return null;
};

export default HistoryFileRow;

import path from 'path';

const checkFileType = (file, fileTypes) => {
  const extension = path.extname(file)?.toLowerCase();
  const typesArr = fileTypes && fileTypes.replace(/ /g, '').split(',');

  return typesArr.includes(extension);
};

const deleteFileFromFormData = (res, value, onChange) => {
  const attachmentRowId = res?.updateAttachmentByRowId?.attachment?.rowId;
  const indexOfFile = value.findIndex(
    (object) => object.id === attachmentRowId
  );
  const newFileList = [...value];
  newFileList.splice(indexOfFile, 1);
  const isFileListEmpty = newFileList.length <= 0;
  onChange(isFileListEmpty ? null : newFileList);
};

const validateFile = (
  file: globalThis.File,
  maxFileSizeInBytes,
  acceptedFileTypes
) => {
  if (!file) return { isValid: false, error: '' };

  const { size } = file;
  if (size > maxFileSizeInBytes) {
    return { isValid: false, error: 'fileSize' };
  }
  if (acceptedFileTypes && !checkFileType(file.name, acceptedFileTypes)) {
    return { isValid: false, error: 'fileType' };
  }

  return { isValid: true, error: null };
};

const handleDownload = async (uuid, fileName) => {
  const url = `/api/s3/download/${uuid}/${fileName}`;
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      if (response.avstatus) {
        window.location.hash = 'file-error';
      } else {
        window.open(response, '_blank');
      }
    });
};

export { checkFileType, deleteFileFromFormData, validateFile, handleDownload };

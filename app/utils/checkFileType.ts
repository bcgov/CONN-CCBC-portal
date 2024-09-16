import path from 'path';

const checkFileType = (file: string, fileTypes: string[]) => {
  const extension = path.extname(file)?.toLowerCase();

  return fileTypes.includes(extension);
};

export default checkFileType;

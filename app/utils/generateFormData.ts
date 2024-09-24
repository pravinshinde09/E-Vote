const regex = /(?:\.([^.]+))?$/;

export const generateFormData = (
  fileUrl: string,
  fileId: string = 'unique()',
  fieldName: string = 'file'
): FormData => {
  const fileName = fileUrl.split('/').pop()!;
  const match = regex.exec(fileName);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append(fieldName, {
    uri: fileUrl,
    name: fileName,
    type,
  } as any);

  return formData;
};

const fileRegex = /\.(\w+)$/;

export const generateFileFormData = (
  fileUrl: string,
  originalFileName: string,
  fileId: string = 'unique()',
  fieldName: string = 'file'
): FormData => {
  const match = fileRegex.exec(originalFileName);
  const type = match ? `application/${match[1]}` : 'application/octet-stream';

  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append(fieldName, {
    uri: fileUrl,
    name: originalFileName,
    type,
  } as any);

  return formData;
};


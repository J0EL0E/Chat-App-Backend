function cleanFileName(filename) {
  // Separate the name and extension
  const lastDotIndex = filename.lastIndexOf('.');
  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex).toLowerCase();

  // Convert to lowercase, remove special characters, and replace spaces with hyphens
  const cleanedName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove all non-alphanumeric except spaces
    .trim()
    .replace(/\s+/g, '-'); // replace one or more spaces with a single hyphen

  // Return the cleaned filename with extension
  return `${cleanedName}${extension}`;
}

module.exports= cleanFileName;
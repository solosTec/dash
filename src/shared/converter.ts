export namespace Converter {
  const appendMissingZero = (dirtyValue: string) => {
    return (
      dirtyValue.slice(0, dirtyValue.lastIndexOf(":") + 1) +
      "0" +
      dirtyValue.slice(dirtyValue.lastIndexOf(":") + 1, dirtyValue.length)
    );
  };

  export const mapTimeStampToHHMMSS = (dirtyValue: string): string => {
    if (!dirtyValue) {
      return dirtyValue;
    }
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-9]{2}$/.test(dirtyValue)) {
      return dirtyValue;
    }
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-9]$/.test(dirtyValue)) {
      return appendMissingZero(dirtyValue);
    }
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-9]{2}.*$/.test(dirtyValue)) {
      return dirtyValue.slice(0, dirtyValue.indexOf("."));
    }
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-9].*$/.test(dirtyValue)) {
      return appendMissingZero(dirtyValue.slice(0, dirtyValue.indexOf(".")));
    }
    return dirtyValue;
  };
}

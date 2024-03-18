export function removeEmptyObj(obj: any) {
  if (typeof obj === 'object') {
    for (const key in obj) {
      removeEmptyObj(obj[key]);
      const isEmpty = !hasValue(obj[key]);
      if (isEmpty) {
        delete obj[key];
      }
    }
  }
}

export function hasValue(obj: any): boolean {
  // Base case: If the object is null or undefined, return false.
  function isEmpty(myObj: any) {
    return (
      myObj === null ||
      myObj === undefined ||
      (typeof myObj === 'string' && myObj.trim() === '')
    );
  }

  if (isEmpty(obj)) {
    return false;
  }

  // Check if the object has any properties.
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // If the property value is not null or undefined, return true.
      if (!isEmpty(obj[key])) {
        return true;
      }
      // Otherwise, recursively check nested properties.
      if (typeof obj[key] === 'object' && this.hasValue(obj[key])) {
        return true;
      }
    }
  }

  // If no properties have non-null or non-undefined values, return false.
  return false;
}

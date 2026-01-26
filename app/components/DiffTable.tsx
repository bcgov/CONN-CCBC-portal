/* eslint-disable no-underscore-dangle */
import styled from 'styled-components';
import formatMoney from 'utils/formatMoney';
import reportClientError from 'lib/helpers/reportClientError';

const StyledTable = styled.table`
  table-layout: auto;

  th,
  td {
    padding: 8px;
    width: 30%;
    overflow-wrap: anywhere;
  }

  thead tr th:first-child,
  tbody tr td:first-child {
    width: 304px;
  }

  tr:last-child td:first-child {
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.12) !important;
  }
`;

const StyledTd = styled.td`
  padding: 8px !important;
`;

const format = (value, type) => {
  if (type === 'number' && value === 0) {
    return '$0';
  }
  if (typeof value === 'number' && type === 'number') {
    return formatMoney(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'undefined' || value === null) {
    return 'N/A';
  }
  if (typeof value === 'string' && value.includes('T00:00:00.000Z')) {
    return value.split('T')[0];
  }

  return value;
};

const sortIfNumberArray = (
  arr: any[],
  arrayItemsType: string | undefined
): string => {
  if (!arr || arr.length === 0) return 'N/A';

  const sorted =
    arrayItemsType === 'number'
      ? [...arr].sort((a, b) => Number(a) - Number(b))
      : arr;

  return sorted.join(', ');
};

const createRow = (
  title,
  newValue,
  oldValue,
  objectName,
  key,
  type,
  excludedKeys
) => {
  if (excludedKeys.some((e) => key === e)) {
    return null;
  }
  return (
    <tr key={`${objectName}-${key}-${newValue}-${oldValue}`}>
      <StyledTd>{title}</StyledTd>
      <StyledTd>{`${format(newValue, type)}`}</StyledTd>
      <StyledTd>
        <s>{`${format(oldValue, type)}`}</s>
      </StyledTd>
    </tr>
  );
};

const handleNullForComparison = (value) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return value;
}

const handleRow = (
  schema,
  parentObject,
  key,
  newValue,
  oldValue,
  addedHeadings,
  excludedKeys
) => {
  const rows = [];
  if (excludedKeys.some((e) => key === e)) {
    return rows;
  }
  if (handleNullForComparison(newValue) === handleNullForComparison(oldValue)){
    return rows;
  }
  if (schema[parentObject]?.properties[key]?.requiresHeading) {
    if (
      !addedHeadings.includes(schema[parentObject].properties[key]?.headingKey)
    ) {
      addedHeadings.push(schema[parentObject].properties[key].headingKey);
      rows.push(
        <tr>
          <td colSpan={3}>
            <b>{schema[parentObject].properties[key]?.heading}</b>
          </td>
        </tr>
      );
    }
  }
  rows.push(
    createRow(
      schema[parentObject]?.properties[key]?.title || key,
      newValue,
      oldValue,
      parentObject,
      key,
      schema[parentObject]?.properties[key]?.type || 'string',
      excludedKeys
    )
  );
  return rows;
};

const handleArrays = (arr1, arr2, schema, objectName, key, excludedKeys) => {
  const maxLength = Math.max(arr1.length, arr2.length);
  const rows = [];

  for (let i = 0; i < maxLength; i += 1) {
    const addedHeadings = [];

    const obj1 = arr1[i] || {};
    const obj2 = arr2[i] || {};

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (schema[objectName].properties[key].requiresHeading) {
      rows.push(
        <tr>
          <td colSpan={3}>
            <b>{`${i + 1}. ${schema[objectName].properties[key].heading}`}</b>
          </td>
        </tr>
      );
    }

    const maxKeys = Math.max(keys1.length, keys2.length);

    for (let j = 0; j < maxKeys; j += 1) {
      let key1 = keys1[j];
      let key2 = keys2[j];

      let value1 = obj1[key1];
      let value2 = obj2[key2];

      if (!key1) {
        key1 = 'N/A';
        value1 = 'N/A';
      }

      if (!key2) {
        key2 = 'N/A';
        value2 = 'N/A';
      }
      rows.push(
        ...handleRow(
          schema,
          objectName,
          key1,
          value1,
          value2,
          addedHeadings,
          excludedKeys
        )
      );
    }
  }
  return rows;
};

const isStructuredArray = (value) =>
  Array.isArray(value) &&
  Array.isArray(value[0]) &&
  ['+', '-', '~', '', ' '].includes(value[0][0]);

const splitStructuredArrayDiff = (
  value: [string, any][],
  traverseNested: (val: any, key: string) => void,
  key: string
): [any[], any[]] => {
  const newArr: any[] = [];
  const oldArr: any[] = [];

  value.forEach(([prefix, diffValue]) => {
    if (prefix === '-') {
      oldArr.push(diffValue);
    } else if (prefix === '~') {
      traverseNested(diffValue, key);
    } else {
      newArr.push(diffValue);
      if (prefix !== '+') {
        oldArr.push(diffValue);
      }
    }
  });

  return [newArr, oldArr];
};

const sanitizedKey = (key: string): string =>
  key.replace(/(__added|__deleted|__old)/g, '');

const generateDiffTable = (
  data: Record<string, any>,
  schema: any,
  excludedKeys: Array<string>,
  overrideParent: string | null
): React.ReactElement => {
  const rows = [];
  const addedHeadings: Array<string> = [];

  const traverse = (object: Record<string, any>, objectName: string) => {
    const entries = Object.entries(object);

    entries.forEach(([key, value]) => {
      const normalizedKey = sanitizedKey(key);
      if (excludedKeys.includes(normalizedKey)) {
        return;
      }
      if (typeof value === 'object' && value !== null) {
        if (isStructuredArray(value)) {
          const [newValueArr, oldValueArr] = splitStructuredArrayDiff(
            value,
            traverse,
            key
          );
          if (newValueArr.length > 0 || oldValueArr.length > 0) {
            if (
              (newValueArr.length > 0 && typeof newValueArr[0] === 'object') ||
              (oldValueArr.length > 0 && typeof oldValueArr[0] === 'object')
            ) {
              rows.push(
                ...handleArrays(
                  newValueArr,
                  oldValueArr,
                  schema,
                  overrideParent || objectName,
                  key,
                  excludedKeys
                )
              );
            } else {
              const arrayItemsType =
                schema[overrideParent || objectName]?.properties[key]?.items
                  ?.type;

              rows.push(
                ...handleRow(
                  schema,
                  overrideParent || objectName,
                  key,
                  sortIfNumberArray(newValueArr, arrayItemsType),
                  sortIfNumberArray(oldValueArr, arrayItemsType),
                  addedHeadings,
                  excludedKeys
                )
              );
            }
          }
        } else if (key.endsWith('__added') || key === '__new') {
          const added = Object.values(value);
          added.forEach((newValue: string | Array<any>, index) => {
            const parent = overrideParent || sanitizedKey(key);
            if (Array.isArray(newValue) && typeof newValue[0] === 'object') {
              newValue.forEach((n) => {
                if (typeof n === 'object') {
                  const a = Object.values(n);
                  a.forEach((b, j) => {
                    rows.push(
                      handleRow(
                        schema,
                        parent,
                        Object.keys(n)[j],
                        b,
                        'N/A',
                        addedHeadings,
                        excludedKeys
                      )
                    );
                  });
                }
              });
            } else if (
              !Array.isArray(newValue) &&
              typeof newValue === 'object' &&
              newValue
            ) {
              const a = Object.values(newValue);
              a.forEach((b, j) => {
                rows.push(
                  handleRow(
                    schema,
                    parent,
                    Object.keys(newValue)[j],
                    b,
                    'N/A',
                    addedHeadings,
                    excludedKeys
                  )
                );
              });
            } else {
              rows.push(
                handleRow(
                  schema,
                  parent,
                  Array.isArray(value)
                    ? sanitizedKey(key)
                    : Object.keys(value)[index],
                  Array.isArray(newValue) ? newValue.join(', ') : newValue,
                  'N/A',
                  addedHeadings,
                  excludedKeys
                )
              );
            }
          });
        } else if (key.endsWith('__deleted')) {
          const deleted = Object.values(value);
          deleted.forEach((oldValue: string, index) => {
            const parent = overrideParent || [sanitizedKey(key)];
            rows.push(
              handleRow(
                schema,
                parent,
                Object.keys(value)[index],
                '',
                oldValue,
                addedHeadings,
                excludedKeys
              )
            );
          });
        } else {
          traverse(value, key);
        }
      } else if (
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        value === null
      ) {
        const parent =
          overrideParent ||
          Object.keys(data)[0].replace(/(__added|__deleted)/g, '');
        if (key === '__old') {
          const oldValue = value;
          const newValue = object.__new;
          rows.push(
            handleRow(
              schema,
              parent,
              objectName,
              newValue,
              oldValue,
              addedHeadings,
              excludedKeys
            )
          );
        } else if (key.endsWith('__added')) {
          const newValue = value;
          const field = sanitizedKey(key);
          rows.push(
            handleRow(
              schema,
              parent,
              field,
              newValue,
              'N/A',
              addedHeadings,
              excludedKeys
            )
          );
        } else if (key.endsWith('__deleted')) {
          const oldValue = value;
          const field = sanitizedKey(key);
          rows.push(
            handleRow(
              schema,
              parent,
              field,
              'N/A',
              oldValue,
              addedHeadings,
              excludedKeys
            )
          );
        }
      }
    });
  };

  traverse(data, '');
  const heading = Object.keys(data)[0].replace(/(__added|__deleted)/g, '');
  return rows.length > 0 ? (
    <StyledTable data-testid="diff-table">
      <thead style={{ borderBottom: '2px solid #CCC' }}>
        <tr>
          <th>{schema[heading]?.title || ' '}</th>
          <th>New</th>
          <th>Old</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </StyledTable>
  ) : null;
};

function createObjectFromSchema(schema, data) {
  const keys = Object.keys(schema.properties);
  return keys.reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {});
}

export const generateRawDiff = (
  data: Record<string, any>,
  schema: any,
  excludedKeys: Array<string>,
  overrideParent: string | null
) => {
  const rows = [];

  const traverse = (object: Record<string, any>, objectName: string) => {
    const entries = Object.entries(object || {});

    entries.forEach(([key, value]) => {
      const normalizedKey = sanitizedKey(key);
      if (excludedKeys.includes(normalizedKey)) {
        return;
      }
      const fieldKey = key.replace(/(__added|__deleted|__old)/g, '');

      // extra exclude for some keys
      if (excludedKeys.includes(fieldKey)) {
        return;
      }

      const parentKey = overrideParent || objectName;
      let fieldSchema =
        schema?.[parentKey]?.properties?.[fieldKey || objectName];
      if (!parentKey) {
        fieldSchema = schema?.[fieldKey];
      }
      const type = fieldSchema?.type || 'string';
      let field;
      if (fieldSchema?.title) {
        field = fieldSchema.title;
      } else if (fieldSchema?.type === 'object') {
        field = fieldKey; // Fallback to key if no title is provided
      }
      const getFieldInfo = (specificKey: string, fs: any = null) => {
        let specificFieldSchema =
          schema?.[parentKey]?.properties?.[specificKey];
        if (overrideParent === null) {
          specificFieldSchema = fs?.properties?.[specificKey];
        }
        return {
          field: specificFieldSchema?.title || specificKey,
          type: specificFieldSchema?.type || 'string',
        };
      };

      // Special handling for object types
      if (
        fieldSchema?.type === 'object' &&
        typeof value === 'object' &&
        value !== null
      ) {
        // Process each file key separately
        Object.keys(value).forEach((fileKey) => {
          const fileValue = value[fileKey];
          let overrideFieldInfoSchema = null;
          if (overrideParent === null) {
            overrideFieldInfoSchema = fieldSchema;
          }
          const { field: fileField, type: fileType } = getFieldInfo(
            fileKey,
            overrideFieldInfoSchema
          );

          if (key.endsWith('__added') || key === '__new') {
            rows.push({
              field: fileField,
              key: fileKey,
              newValue: format(fileValue, fileType),
              oldValue: 'N/A',
            });
          } else if (key.endsWith('__deleted')) {
            rows.push({
              field: fileField,
              key: fileKey,
              newValue: 'N/A',
              oldValue: format(fileValue, fileType),
            });
          } else if (typeof fileValue === 'object' && fileValue !== null) {
            if (fileValue.__old !== undefined) {
              rows.push({
                field: fileField,
                key: fileKey,
                newValue: format(fileValue.__new, fileType),
                oldValue: format(fileValue.__old, fileType),
              });
            }
          }
        });
        return; // Skip the rest of the processing for this key
      }
      if (typeof value === 'object' && value !== null) {
        if (isStructuredArray(value)) {
          const [newValueArr, oldValueArr] = splitStructuredArrayDiff(
            value,
            traverse,
            key
          );
          if (newValueArr.length > 0 || oldValueArr.length > 0) {
            if (
              (newValueArr.length > 0 && typeof newValueArr[0] === 'object') ||
              (oldValueArr.length > 0 && typeof oldValueArr[0] === 'object')
            ) {
              rows.push({
                field,
                key,
                newValue: newValueArr,
                oldValue: oldValueArr,
              });
            } else {
              rows.push({
                field,
                key,
                newValue: newValueArr.join(','),
                oldValue: oldValueArr.join(','),
              });
            }
          }
        } else if (key.endsWith('__added') || key === '__new') {
          const added = Object.values(value);
          added.forEach((newValue: string | Array<any>, index) => {
            if (Array.isArray(newValue) && typeof newValue[0] === 'object') {
              newValue.forEach((n) => {
                if (typeof n === 'object') {
                  const a = Object.values(n);
                  a.forEach((b, j) => {
                    rows.push({
                      field,
                      key: Object.keys(n)[j],
                      newValue: format(b, type),
                      oldValue: 'N/A',
                    });
                  });
                }
              });
            } else if (
              !Array.isArray(newValue) &&
              typeof newValue === 'object' &&
              newValue
            ) {
              const a = Object.values(newValue);
              a.forEach((b, j) => {
                rows.push({
                  field,
                  key: Object.keys(newValue)[j],
                  newValue: format(b, type),
                  oldValue: 'N/A',
                });
              });
            } else {
              rows.push({
                field,
                key: Array.isArray(value)
                  ? sanitizedKey(key)
                  : Object.keys(value)[index],
                newValue: Array.isArray(newValue)
                  ? newValue.join(', ')
                  : newValue,
                oldValue: 'N/A',
              });
            }
          });
        } else if (key.endsWith('__deleted')) {
          const deleted = Object.values(value);
          deleted.forEach((oldValue: string, index) => {
            rows.push({
              field,
              key: Object.keys(value)[index],
              newValue: 'N/A',
              oldValue: format(oldValue, type),
            });
          });
        } else {
          traverse(value, key);
        }
      } else if (
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        value === null
      ) {
        if (key === '__old') {
          const oldValue = format(value, type);
          const newValue = format(object.__new, type);
          rows.push({
            field,
            key: objectName,
            newValue,
            oldValue,
          });
        } else if (key.endsWith('__added')) {
          const newValue = format(value, type);
          rows.push({
            field,
            key: field,
            newValue,
            oldValue: 'N/A',
          });
        } else if (key.endsWith('__deleted')) {
          const oldValue = format(value, type);
          rows.push({
            field,
            key: field,
            newValue: 'N/A',
            oldValue,
          });
        }
      }
    });
  };

  traverse(data, '');
  return rows;
};

export const processArrayDiff = (changes, schema) => {
  const newArray = [];
  const oldArray = [];

  const entries = Object.entries(changes);
  entries.forEach(([key, value]) => {
    if (key.endsWith('__added') && Array.isArray(value)) {
      newArray.push(...value);
    } else if (key.endsWith('__deleted') && Array.isArray(value)) {
      oldArray.push(...value);
    } else if (Array.isArray(value)) {
      value.forEach(([prefix, diffValue]) => {
        if (prefix === '-') {
          oldArray.push(diffValue);
        } else if (prefix === '~') {
          ['__old', '__new'].forEach((childKey, idx) => {
            const newObject = createObjectFromSchema(schema, {
              er: diffValue.er[childKey],
              rd: diffValue.rd[childKey],
            });
            if (idx === 0) {
              oldArray.push(newObject);
            } else {
              newArray.push(newObject);
            }
          });
        } else if (prefix === '+') {
          newArray.push(diffValue);
        }
      });
    }
  });

  return [newArray, oldArray];
};

interface Props {
  changes: any;
  diffSchema: any;
  excludedKeys: Array<string>;
  overrideParent?: string | null;
}

const DiffTable: React.FC<Props> = ({
  changes,
  diffSchema,
  excludedKeys,
  overrideParent = null,
}) => {
  let diffTable;
  try {
    diffTable = generateDiffTable(
      changes,
      diffSchema,
      excludedKeys,
      overrideParent
    );
  } catch (error) {
    reportClientError(error, { source: 'diff-table' });
    diffTable = (
      <div>
        An error occurred and the edits could not be determined. If this
        continues, please contact the administrator of the CCBC portal.
      </div>
    );
  }
  return diffTable;
};

export default DiffTable;

/* eslint-disable no-underscore-dangle */
import styled from 'styled-components';

const StyledTable = styled.table`
  table-layout: auto;

  thead tr th:first-child,
  tbody tr td:first-child {
    width: 304px;
  }
`;

const createRow = (title, newValue, oldValue, objectName, key) => {
  return (
    <tr key={`${objectName}-${key}-${newValue}-${oldValue}`}>
      <td>{title}</td>
      <td>{newValue}</td>
      <td>
        <s>{oldValue}</s>
      </td>
    </tr>
  );
};

const handleRow = (
  schema,
  parentObject,
  key,
  newValue,
  oldValue,
  addedHeadings
) => {
  const rows = [];
  if (schema[parentObject].properties[key]?.requiresHeading) {
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
      schema[parentObject].properties[key].title,
      newValue,
      oldValue,
      parentObject,
      key
    )
  );
  return rows;
};

const handleArrays = (arr1, arr2, schema, objectName, key) => {
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
        ...handleRow(schema, objectName, key1, value1, value2, addedHeadings)
      );
    }
  }
  return rows;
};

const generateDiffTable = (
  data: Record<string, any>,
  schema: any,
  excludedKeys: Array<string>
): React.ReactElement => {
  const rows = [];
  const addedHeadings: Array<string> = [];

  const traverse = (object: Record<string, any>, objectName: string) => {
    const entries = Object.entries(object);

    entries.forEach(([key, value]) => {
      if (excludedKeys.some((e) => key.includes(e))) {
        return;
      }
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          const [newValueArr, oldValueArr] = value.reduce(
            ([newArr, oldArr], [prefix, diffValue]) => {
              if (prefix === '-') {
                oldArr.push(diffValue);
              } else if (prefix === '~') {
                traverse(diffValue, key);
              } else {
                newArr.push(diffValue);
                if (prefix !== '+') {
                  oldArr.push(diffValue);
                }
              }
              return [newArr, oldArr];
            },
            [[], []]
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
                  objectName,
                  key
                )
              );
            } else {
              rows.push(
                ...handleRow(
                  schema,
                  objectName,
                  key,
                  newValueArr.join(','),
                  oldValueArr.join(','),
                  addedHeadings
                )
              );
            }
          }
        } else if (key.endsWith('__added')) {
          const added = Object.values(value);
          added.forEach((newValue: string | Array<any>, index) => {
            const parent = key.replace(/(__added|__deleted)/g, '');
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
                        addedHeadings
                      )
                    );
                  });
                }
              });
            } else {
              rows.push(
                handleRow(
                  schema,
                  parent,
                  Object.keys(value)[index],
                  Array.isArray(newValue) ? newValue.join(', ') : newValue,
                  'N/A',
                  addedHeadings
                )
              );
            }
          });
        } else if (key.endsWith('__deleted')) {
          const deleted = Object.values(value);
          deleted.forEach((oldValue: string, index) => {
            const parent = [key.replace(/(__added|__deleted)/g, '')];
            rows.push(
              handleRow(
                schema,
                parent,
                Object.keys(value)[index],
                '',
                oldValue,
                addedHeadings
              )
            );
          });
        } else {
          traverse(value, key);
        }
      } else if (
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number'
      ) {
        const parent = Object.keys(data)[0].replace(/(__added|__deleted)/g, '');
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
              addedHeadings
            )
          );
        } else if (key.endsWith('__added')) {
          const newValue = value;
          const field = key.replace(/(__added|__deleted)/g, '');
          rows.push(
            handleRow(schema, parent, field, newValue, 'N/A', addedHeadings)
          );
        } else if (key.endsWith('__deleted')) {
          const oldValue = value;
          const field = key.replace(/(__added|__deleted)/g, '');
          rows.push(
            handleRow(schema, parent, field, 'N/A', oldValue, addedHeadings)
          );
        }
      }
    });
  };

  traverse(data, '');
  const heading = Object.keys(data)[0].replace(/(__added|__deleted)/g, '');
  return rows.length > 0 ? (
    <StyledTable>
      <thead>
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

interface Props {
  changes: any;
  diffSchema: any;
  excludedKeys: Array<string>;
}

const DiffTable: React.FC<Props> = ({ changes, diffSchema, excludedKeys }) => {
  return generateDiffTable(changes, diffSchema, excludedKeys);
};

export default DiffTable;

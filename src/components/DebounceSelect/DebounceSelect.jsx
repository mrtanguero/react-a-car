import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const DebounceSelect = React.forwardRef(
  ({ fetchOptions, debounceTimeout = 800, ...props }, ref) => {
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchRef = React.useRef(0);
    const debounceFetcher = React.useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions({ queryKey: [null, { searchTerm: value }] }).then(
          (newOptions) => {
            if (fetchId !== fetchRef.current) {
              // for fetch callback order
              return;
            }
            const renderedOptions = newOptions.data.data.map((client) => {
              return {
                value: client.id,
                label: client.name,
              };
            });

            setOptions(renderedOptions);
            setFetching(false);
          }
        );
      };

      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
      <Select
        labelInValue
        showSearch
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        options={options}
        ref={ref}
        {...props}
      />
    );
  }
);

export default DebounceSelect;

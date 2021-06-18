import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

const MyAsyncSelect = React.forwardRef(
  ({ queryFn, valueName, labelName, ...otherProps }, ref) => {
    const loadOptions = async (search, pageParam) => {
      const {
        data: { data: optionsArr, next_page_url: nextPageUrl },
      } = await queryFn({
        pageParam,
        queryKey: [null, { searchTerm: search }],
      });
      console.log(optionsArr, nextPageUrl);

      const options = optionsArr.map((option) => {
        return {
          value: option[valueName],
          label: option[labelName],
        };
      });
      console.log(options);

      let filteredOptions;
      if (!search) {
        filteredOptions = options;
      } else {
        const searchLower = search.toLowerCase();

        filteredOptions = options.filter(({ label }) =>
          label.toLowerCase().includes(searchLower)
        );
      }

      const hasMore = !!nextPageUrl;

      return {
        options: filteredOptions,
        hasMore,
      };
    };

    const defaultAdditional = {
      page: 1,
    };

    const loadPageOptions = async (q, prevOptions, { page }) => {
      const { options, hasMore } = await loadOptions(q, page);

      return {
        options,
        hasMore,

        additional: {
          page: page + 1,
        },
      };
    };

    return (
      <AsyncPaginate
        {...otherProps}
        loadOptions={loadPageOptions}
        additional={defaultAdditional}
        debounceTimeout={500}
      />
    );
  }
);

export default MyAsyncSelect;

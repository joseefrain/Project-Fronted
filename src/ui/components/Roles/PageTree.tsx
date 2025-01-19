import { IPageTreeProps } from '../../../interfaces/roleInterfaces';
import {
  DEFAULT_ROLE_PAGES,
  getLevelValueLabel,
} from '../../../shared/helpers/roleHelper';
import { Checkbox } from '../../../components/ui/checkbox';
import './styles.scss';

export default function PageTree({
  selectedPages,
  readonly,
  handleOnChangeModule,
  handleOnChangeLevel,
}: IPageTreeProps) {
  return (
    <div
      className={`default__page__tree ${readonly ? 'max-h-[50vh]' : 'max-h-[43vh]'}`}
    >
      {DEFAULT_ROLE_PAGES.map((page) => (
        <div
          key={page.module}
          className="p-3 border rounded-md bg-gray-50 w-[99%] dark:bg-gray-950 dark:border-gray-800"
        >
          <div className="flex items-center mb-3 space-x-2">
            <Checkbox
              id={`page-${page.module}`}
              className="p-0"
              checked={
                selectedPages.find((p) => p.module === page.module)?.levels
                  .length === page.levels.length
              }
              onCheckedChange={() => handleOnChangeModule(page.module)}
              disabled={readonly}
            />
            <label
              htmlFor={`page-${page.module}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {page.module}
            </label>
          </div>

          <div className="ml-6 space-y-2">
            {page.levels.map((action) => (
              <div
                key={`${page.module}-${action}`}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`${page.module}-${action}`}
                  className="p-0"
                  checked={
                    selectedPages
                      .find((p) => p.module === page.module)
                      ?.levels?.includes(action) ?? false
                  }
                  onCheckedChange={() =>
                    handleOnChangeLevel(page.module, action)
                  }
                  disabled={readonly}
                />
                <label
                  htmlFor={`${page.module}-${action}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {getLevelValueLabel(action)}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

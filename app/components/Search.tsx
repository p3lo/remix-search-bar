import { DialogProps } from '@radix-ui/react-dialog';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { CommandDialog, CommandInput, CommandList } from '~/components/ui/command';
import { cn } from '~/lib/utils';
import { useEffect, useState } from 'react';
import { useDebounceSubmit } from 'remix-utils/use-debounce-submit';
import { loader } from '~/root';

function Search({ ...props }: DialogProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher<typeof loader>({ key: 'search' });
  const submit = useDebounceSubmit();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <fetcher.Form method="get" action="/">
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={(e) => {
              submit(
                { search_string: e },
                {
                  navigate: false,
                  fetcherKey: 'search',
                  debounceTimeout: 500,
                  action: '/',
                  method: 'get',
                }
              );
            }}
          />
          <CommandList>
            {(fetcher.data?.data as string) ? (
              <p className="p-3 text-sm">{JSON.stringify(fetcher.data?.data)}</p>
            ) : (
              <div className="w-full items-center justify-center flex p-3">
                <p className="text-sm">No results found</p>
              </div>
            )}
          </CommandList>
        </fetcher.Form>
      </CommandDialog>
    </>
  );
}

export default Search;

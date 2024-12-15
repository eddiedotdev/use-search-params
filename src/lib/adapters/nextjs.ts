import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useNextAdapter() {
  const router = useRouter();
  const pathname = usePathname();
  const nextSearchParams = useSearchParams();

  if (!nextSearchParams) {
    console.error('[NextAdapter] searchParams is undefined');
    throw new Error('searchParams is undefined - ensure this is used in a Client Component');
  }

  // Debug object for the entire adapter state
  const debugState = {
    pathname,
    hasRouter: !!router,
    hasSearchParams: !!nextSearchParams,
    searchParamsContent: nextSearchParams.toString(),
  };
  console.table(debugState);

  // Create a mutable copy that will be used for all operations
  const mutableSearchParams = new URLSearchParams(nextSearchParams.toString());

  const navigate = (url: string) => {
    try {
      const queryString = url.split('?')[1] || '';
      const newParams = new URLSearchParams(queryString);
      
      // Debug navigation attempt
      console.group('[NextAdapter] Navigation');
      console.log('Original URL:', url);
      console.log('Query string:', queryString);
      console.log('New params:', Object.fromEntries(newParams.entries()));
      console.groupEnd();

      mutableSearchParams.forEach((_, key) => mutableSearchParams.delete(key));
      newParams.forEach((value, key) => mutableSearchParams.append(key, value));
      
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, {
        scroll: false
      });
    } catch (error) {
      console.error('[NextAdapter] Navigation error:', error);
      throw error;
    }
  };

  return {
    pathname,
    searchParams: mutableSearchParams,
    navigate,
  };
}
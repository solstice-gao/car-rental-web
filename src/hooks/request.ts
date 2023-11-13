import { ref, UnwrapRef } from 'vue';
import { AxiosResponse } from 'axios';
import { HttpResponse } from '@/api/interceptor';
import useLoading from './loading';

// use to fetch list
// Don't use async function. It doesn't work in async function.
// Use the bind function to add parameters
// example: useRequest(api.bind(null, {}))

export default function useRequest<T>(
  api: () => Promise<AxiosResponse<HttpResponse>>,
  defaultValue = [] as unknown as T,
  isLoading = true
) {
  const { loading, setLoading } = useLoading(isLoading);
  const response = ref<T>(defaultValue);
  api()
    .then((res) => {
      response.value = res.data.data.records as unknown as UnwrapRef<T>;
    })
    .finally(() => {
      setLoading(false);
    });
  return { loading, response };
}


export function sendRequest<T>(
  api: () => Promise<AxiosResponse<HttpResponse>>
) {
  const response = ref<T | null>(null);

  try {
    api()
      .then((res) => {
        response.value = res.data.data as unknown as T;
      })
  } catch (error) {
    // 处理请求失败的情况
    console.error('Request failed:', error);
  }

  return { response };
}
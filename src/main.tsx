import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // ข้อมูลสดใหม่ 5 นาที
      refetchInterval: 1000 * 60 * 10, // ยิง API ใหม่ให้เองทุกๆ 10 นาที
      gcTime: 1000 * 60 * 30,          // เก็บ cache ที่ไม่มีใครใช้ไว้ 30 นาที
      retry: 1,                        // ลองใหม่ 1 ครั้งเมื่อล้มเหลว (ค่าเริ่มต้นคือ 3)
      refetchOnWindowFocus: false,     // ไม่ยิงใหม่ทุกครั้งที่กลับมาที่แท็บ
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

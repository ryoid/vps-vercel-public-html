import { Component } from 'solid-js'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { documentProps } from '../pages/dashboard/index.page';

export type DefaultPageProps<T> =  T & {
  date?: string
  routeParams?: Record<string, string | number>
}

export type DocumentProps = {
  title?: string
  description?: string
}

export type PageContext<T = DefaultPageProps<{}>> = PageContextBuiltIn & {
  Page: (pageProps: DefaultPageProps<T>) => Component
  pageProps: DefaultPageProps<T>
  pageExports: {
    documentProps?: DocumentProps
  }
  documentProps?: DocumentProps
}

import { hydrate, render } from 'solid-js/web'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { PageLayout } from './PageLayout'

let dispose: () => void

const { hydrationPromise } = useClientRouter({
  render(pageContext) {
    const content = document.getElementById('page-view')
    const { Page, routeParams } = pageContext
    const pageProps = pageContext.pageProps || {}

    // Pass route params pageProps
    pageProps.routeParams = routeParams

    // Dispose to prevent duplicate pages when navigating.
    if (dispose) dispose()

    // Render the page
    if (pageContext.isHydration) {
      // This is the first page rendering; the page has been rendered to HTML
      // and we now make it interactive.
      dispose = hydrate(
        () => (
          <PageLayout>
            <Page {...pageProps} />
          </PageLayout>
        ),
        content!,
      )
    } else {
      // Client navigate update title from document props
      // Use documentProps from context first (set onBeforeRender), fallback to pageExports
      let documentProps = pageContext.documentProps || pageContext.pageExports.documentProps
      document.title = documentProps?.title || 'Vite SSR app'

      // Render new page
      render(
        () => (
          <PageLayout>
            <Page {...pageProps} />
          </PageLayout>
        ),
        content!,
      )
    }
  },
  onTransitionStart,
  onTransitionEnd,
})

hydrationPromise.then((s) => {
  console.log('Hydration finished; page is now interactive.')
})

function onTransitionStart() {
  // console.log('Page transition start')
}
function onTransitionEnd() {
  // console.log('Page transition end')
}

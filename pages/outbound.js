import { JsonApiLink } from "apollo-link-json-api";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import addApiRouteHeader from "../utils/addApiRouteHeader";
import cacheAwareFetch from "../utils/cacheAwareFetch";

function Outbound({ ...props }) {
  return (
    <div>
      This route makes three outbound API requests:
      <ul>
        <li>{ props.root.links.self}</li>
        <li>{ props.articles.links.self}</li>
        <li>{ props.blocks.links.self}</li>
        <li>{ props.title }</li>
      </ul>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  const root = await fetch(`https://live-contentacms.pantheonsite.io/api`)
    .then(async (response) => {
      /**
       * Given our options, I think our best bet is a generic function that adds all 
       * url routes to a header in the response. It should be possible to use this
       * function with other data fetching libraries, other frameworks, or even just
       * calling it explicitly where necessary.
       */
      addApiRouteHeader(response.url, context.res);
      return await response.json();
    });

  /**
   * I don't think a custom data function as shown below is practical.
   * 
   * 1. Overriding fetch globally to add a header to the response doesn't
   * seem to be possible. The new fetch function would need to have access
   * to the response object, and NextJS only seems to make that available
   * in some functions like getServerSideProps.
   * 
   * 2. Since we have to pass the response object, it changes the signature
   * of fetch - which I don't think developers would be pleased with.
   * 
   * 3. I still think that creating overrides or wrappers for various popular
   * data fetching options (think Axios, SWR) is a losing battle. 
   */
  const articles = await cacheAwareFetch(root.links.articles, context.res)
    .then(async (response) => {
      return await response.json();
    });

  const blocks = await fetch(root.links.blocks, context.res)
    .then(async (response) => {
      addApiRouteHeader(response.url, context.res);
      return await response.json();
    });

  // After the three API calls above, the resulting response will contain the header:
  // api-routes: https://live-contentacms.pantheonsite.io/api,https://live-contentacms.pantheonsite.io/api/articles,https://live-contentacms.pantheonsite.io/api/blocks

  const jsonApiLink = new JsonApiLink({
    uri: 'http://drupal-next.lndo.site/jsonapi/',
  });

  const client = new ApolloClient({
    link: jsonApiLink,
    cache: new InMemoryCache(),
  });

  const query = gql`
    query firstarticle {
      article @jsonapi(path: "node/article/b135b62c-a049-4c34-8db5-3941a448c1c5") {
        title
        body
      }
    }
  `;

  // Invoke the query and log the person's name
  const title = await client.query({ query }).then(async response => {
    return await response.data.article.title;
  });

  // const jsonApiLink = new JsonApiLink({
  //   uri: 'http://jsonapiplayground.reyesoft.com/v2/',
  // });

  // const client = new ApolloClient({
  //   link: jsonApiLink,
  //   cache: new InMemoryCache(),
  // });

  // const query = gql`
  //   query firstAuthor {
  //     author @jsonapi(path: "authors/1") {
  //       name
  //     }
  //   }
  // `;

  // // Invoke the query and log the person's name
  // const name = await client.query({ query }).then(async response => {
  //   return await response.data.author.name;
  // });

  // Pass data to the page via props
  return { props: { root, articles, blocks, title } }
}

export default Outbound 
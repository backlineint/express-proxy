function Outbound({ ...props }) {
  console.log("Root API", props.dataRoot);
  console.log("Articles API", props.dataArticles);
  console.log("Blocks API", props.dataBlocks);
  return (
    <div>
      This route makes three outbound API requests:
      <ul>
        <li>{ props.dataRoot.links.self}</li>
        <li>{ props.dataArticles.links.self}</li>
        <li>{ props.dataBlocks.links.self}</li>
      </ul>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const root = await fetch(`https://live-contentacms.pantheonsite.io/api`);
  const dataRoot = await root.json();

  const articles = await fetch(dataRoot.links.articles);
  const dataArticles = await articles.json();

  const blocks = await fetch(dataRoot.links.blocks);
  const dataBlocks = await blocks.json();

  // Pass data to the page via props
  return { props: { dataRoot, dataArticles, dataBlocks } }
}

export default Outbound 
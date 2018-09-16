const path = require('path')
const {createFilePath} = require('gatsby-source-filesystem')

const formatSlug = x => x.replace(/[^\/].*_/, '')

exports.onCreateNode = ({node, getNode, actions}) => {
  const {createNodeField} = actions

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({node, getNode, basePath: 'pages'})

    createNodeField({
      node,
      name: 'slug',
      value: formatSlug(slug),
    })
  }
}

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.data) {
        result.data.allMarkdownRemark.edges.forEach(({node}) => {
          createPage({
            path: node.fields.slug,
            component: path.resolve('./src/templates/blog-post.js'),
            context: {
              slug: node.fields.slug,
            },
          })
        })
      }
      resolve()
    })
  })
}

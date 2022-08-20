export default {
  layout: {
    gap: 15,
    item: {
      width: 34,
      height: 34,
      gap: 3,
    },
    subcategory: {
      header: {
        fontSize: 14,
      },
    },
    category: {
      borderSize: 2,
      header: {
        height: 40,
      },
    },
    header: {
      height: 50,
    },
    footer: {
      height: 20,
    },
  },
  style: {
    landscape: {
      fontSize: "14px",
      background: "#1b446c",
      color: "white",
    },
    category: {
      backgroundColor: "#0086ff",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
      padding: "0 2px 2px",
      body: {
        backgroundColor: "white",
      },
      header: {
        fontWeight: 500,
      },
    },
    subcategory: {
      header: {
        color: "#272c36",
      },
    }
  },
  // Item: {
  //   width: 34,
  //   height: 34,
  //   border: "1px solid grey",
  //   borderRadius: "2px",
  //   variants: {
  //     large: {
  //       padding: "2px",
  //       margin: "2px 2px 0 2px"
  //     }
  //   }
  // },
};

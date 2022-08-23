export default {
  layout: {
    gap: 15,
    item: {
      width: 34,
      height: 34,
      gap: 3,
      // variants: {
      //   graduated: {
      //     extend: "Large"
      //   },
      //   incubating: {
      //     extend: "Large"
      //   }
      // }
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
    },
    Item: {
      border: "1px solid gray",
      backgroundColor: "white",
      variants: {
        Gray: {
          backgroundColor: "#E8E8E8",
          Image: {
            padding: "1px"
          }
        },
        Graduated: {
          border: "2px solid rgb(24,54,114)",
          borderBottom: 0,
          Label: {
            backgroundColor: "rgb(24,54,114)",
            paddingTop: "2px",
            color: "white",
            fontSize: "8px"
          },
          Image: {
            padding: "2px"
          }
        },
        Incubating: {
          border: "2px solid rgb(83, 113, 189)",
          borderBottom: 0,
          Label: {
            backgroundColor: "rgb(83, 113, 189)",
            paddingTop: "2px",
            color: "white",
            fontSize: "8px"
          },
          Image: {
            padding: "2px"
          }
        }
      }
    },
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

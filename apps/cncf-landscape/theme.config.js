export default {
  Layout: {
    gap: 15,
    Item: {
      width: 34,
      height: 34,
      gap: 3,
      Variants: {
        Graduated: {
          extend: "Large"
        },
        Incubating: {
          extend: "Large"
        }
      }
    },
    Subcategory: {
      Header: {
        fontSize: 14,
      },
    },
    Category: {
      borderWidth: 2,
      Header: {
        height: 40,
      },
    },
    Header: {
      height: 50,
    },
    Footer: {
      height: 20,
    },
  },
  Style: {
    Landscape: {
      fontSize: "14px",
      backgroundColor: "#1b446c"
    },
    Category: {
      backgroundColor: "#0079e6",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
      padding: "0 2px 2px",
      Body: {
        backgroundColor: "white",
      },
      Header: {
        fontWeight: 500,
      },
    },
    Item: {
      border: "1px solid gray",
      backgroundColor: "white",
      Image: {
        padding: "1px"
      },
      Variants: {
        Gray: {
          backgroundColor: "#E8E8E8",
        },
        Large: {
          Label: {
            paddingTop: "2px",
            color: "white",
            fontSize: "8px"
          },
          Image: {
            padding: "2px"
          }
        },
        Graduated: {
          extend: "Large",
          border: "2px solid rgb(24,54,114)",
          Label: {
            backgroundColor: "rgb(24,54,114)",
          },
        },
        Incubating: {
          extend: "Large",
          border: "2px solid rgb(83, 113, 189)",
          Label: {
            backgroundColor: "rgb(83, 113, 189)",
          }
        }
      }
    },
  }
};

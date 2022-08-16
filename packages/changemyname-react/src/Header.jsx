import { headerHeight } from "./utils/landscapeCalculations.js";

const headerStyle = {
  height: headerHeight,
};

const Header = ({ header }) => {
  return (
    <div className="landscape--header" style={headerStyle}>
      {header.map((child, idx) => {
        const baseClassName =
          "landscape--header--item landscape--header--item--";

        if (child.type === "image") {
          return (
            <div key={idx} className={`${baseClassName}image`}>
              <img src={child.src} />
            </div>
          );
        } else if (child.type === "html") {
          const __html = child.content;
          return (
            <div
              key={idx}
              dangerouslySetInnerHTML={{ __html }}
              className={`${baseClassName}html`}
            />
          );
        } else {
          return (
            <div key={idx} className={`${baseClassName}other`}>
              {child.content}
            </div>
          );
        }
      })}
    </div>
  );
};

export default Header;

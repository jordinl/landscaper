import React from "react";

const InternalLink = ({ to, children, onClick, className, ...other }) => {
  return (
    <span className={`${className}`} {...other}>
      {children}
    </span>
  );
  // const { params } = useContext(LandscapeContext)
  // if (params.isEmbed || isGoogle() || params.onlyModal || !to) {
  //   return <span className={`${className}`} {...other}>{children}</span>;
  // } else {
  //   return <Link href={to} prefetch={false}>
  //     <a className={`${className} nav-link`} {...other}>{children}</a>
  //   </Link>
  // }
};
export default InternalLink;

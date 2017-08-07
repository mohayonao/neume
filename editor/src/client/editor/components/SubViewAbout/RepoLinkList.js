import React from "react";
import PropTypes from "prop-types";

export default function RepoLinkList({ repoLinks }) {
  const elems = repoLinks.map(({ name, link }) =>
    <LinkItem key={ name } { ...{ name, link } } />
  );
  return (<ul>{ elems }</ul>);
}

RepoLinkList.propTypes = {
  repoLinks: PropTypes.array.isRequired,
};

export function LinkItem(props) {
  const { name, link } = props;

  return (
    <li>
      <label>{ name }</label>
      <a href={ link } target="_blank" rel="noreferrer noopener">
        { link }
      </a>
    </li>
  )
}

LinkItem.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

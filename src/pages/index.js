import React from 'react'
import classNames from 'classnames'
import { ContainerQuery } from 'react-container-query'
import { Link } from 'gatsby'
import { Anchor, Menu, Dropdown, Icon } from 'antd';

import styles from './index.module.less';


const query = {
  [styles.screenXS]: {
    maxWidth: 744,
  },
  [styles.screenMD]: {
    minWidth: 745,
    maxWidth: 960,
  },
  [styles.screenLG]: {
    minWidth: 961,
    maxWidth: 1199,
  },
  [styles.screenXL]: {
    minWidth: 1200,
  },
};


class IndexPage extends React.PureComponent{
  render() {
    return (
      <ContainerQuery query={query}>
        {(params) => (
          <div className={classNames(params, styles.wrap)}>
              yunle-template-gatsby
          </div>
        )}
      </ContainerQuery>
    )
  }
}

export default IndexPage

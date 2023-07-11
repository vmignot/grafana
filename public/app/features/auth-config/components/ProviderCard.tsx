import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Badge, Card, useStyles2, Icon } from '@grafana/ui';

import { BASE_PATH } from '../constants';

export const LOGO_SIZE = '48px';

type Props = {
  providerId: string;
  displayName: string;
  enabled: boolean;
  configPath?: string;
  authType?: string;
  badges?: JSX.Element[];
  onClick?: () => void;
};

export function ProviderCard({ providerId, displayName, enabled, configPath, authType, onClick }: Props) {
  const styles = useStyles2(getStyles);
  configPath = BASE_PATH + (configPath || providerId);

  return (
    <Card href={configPath} className={styles.container} onClick={() => onClick && onClick()}>
      <Card.Heading className={styles.name}>{displayName}</Card.Heading>
      <div className={styles.footer}>
        <div className={styles.badgeContainer}>
          {enabled ? <Badge text="Enabled" color="green" icon="check" /> : <Badge text="Not enabled" color="blue" />}
          {authType && <Badge text={authType} color="green" />}
        </div>
        <span className={styles.edit}>
          Edit
          <Icon color="blue" name={'arrow-right'} size="sm" />
        </span>
      </div>
    </Card>
  );
}

export const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      min-height: ${theme.spacing(16)};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${theme.spacing(2)};
    `,
    header: css`
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: ${theme.spacing(2)};
    `,
    footer: css`
      display: flex;
      justify-content: space-between;
      align-items: center; // vertically align the items
    `,
    name: css`
      align-self: flex-start;
      font-size: ${theme.typography.h4.fontSize};
      color: ${theme.colors.text.primary};
      margin: 0;
    `,
    badgeContainer: css`
      display: flex;
      gap: ${theme.spacing(1)}; // add some space between the badges
    `,
    initext: css`
      font-size: ${theme.typography.bodySmall.fontSize};
      color: ${theme.colors.text.secondary};
      padding: ${theme.spacing(1)} 0; // Add some padding
      max-width: 90%; // Add a max-width to prevent text from stretching too wide
    `,
    edit: css`
      display: flex;
      align-items: center; // vertically align the text and the icon
      color: ${theme.colors.text.link};
      gap: ${theme.spacing(0.5)}; // add some space between the text and the icon
    `,
  };
};

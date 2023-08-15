import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { EmbeddedScene, SceneFlexLayout, SceneTimeRange } from '@grafana/scenes';
import { useStyles2 } from '@grafana/ui';

import { getFiringAlertsScene } from './insights/grafana/FiringAlertsPercentage';
import { getFiringAlertsRateScene } from './insights/grafana/FiringAlertsRate';
import { getMostFiredInstancesScene } from './insights/grafana/MostFiredInstancesTable';
import { getMostFiredRulesScene } from './insights/grafana/MostFiredRulesTable';
import { useAlertmanager } from './state/AlertmanagerContext';
import { GRAFANA_RULES_SOURCE_NAME } from './utils/datasource';

//all cloud instances are guaranteed to have this datasource uid for the alert state history loki datasource
const datasourceUid = 'grafanacloud-alert-state-history';

const datasource = {
  type: 'loki',
  uid: datasourceUid,
};

const THIS_WEEK_TIME_RANGE = new SceneTimeRange({ from: 'now-1w', to: 'now' });
const LAST_WEEK_TIME_RANGE = new SceneTimeRange({ from: 'now-2w', to: 'now-1w' });

function getGrafanaScenes() {
  return new EmbeddedScene({
    body: new SceneFlexLayout({
      wrap: 'wrap',
      children: [
        getMostFiredRulesScene(THIS_WEEK_TIME_RANGE, datasource, 'Alert rules - fired most over the past week'),

        getMostFiredInstancesScene(THIS_WEEK_TIME_RANGE, datasource, 'Alert instances - fired most over the past week'),

        getFiringAlertsScene(THIS_WEEK_TIME_RANGE, datasource, 'Firing alerts this week'),

        getFiringAlertsScene(LAST_WEEK_TIME_RANGE, datasource, 'Firing alerts last week'),

        getFiringAlertsRateScene(THIS_WEEK_TIME_RANGE, datasource, 'Alerts firing per minute'),
      ],
    }),
  });
}

export default function Insights() {
  const styles = useStyles2(getStyles);

  const { selectedAlertmanager } = useAlertmanager();
  const isGrafanaAmSelected = selectedAlertmanager === GRAFANA_RULES_SOURCE_NAME;

  const scene = isGrafanaAmSelected ? getGrafanaScenes() : null;

  return (
    <div className={styles.container}>
      {(scene && <scene.Component model={scene} />) || 'There are no panels for the selected alertmanager'}
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    padding: '10px 0 10px 0',
  }),
});

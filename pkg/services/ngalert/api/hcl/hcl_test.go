package hcl

import (
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
)

func TestMarshall(t *testing.T) {
	ruleGroup := definitions.AlertRuleGroupExport{
		OrgID:           1,
		Name:            "Test-group",
		FolderUID:       "test-folder-uid",
		IntervalSeconds: 60,
		Rules: []definitions.AlertRuleExport{
			{
				UID:       "rule-1",
				Title:     "rule-test",
				Condition: "A",
				Data: []definitions.AlertQueryExport{
					{
						RefID:     "A",
						QueryType: "query-type",
						RelativeTimeRange: definitions.RelativeTimeRange{
							From: 1000000,
							To:   2000000,
						},
						DatasourceUID: "data-source-uid",
						ModelString:   `{ "data": "test", "data-obj": {"sub-obj": "data"}, "arr": ["arr1", "arr2"]}`,
					},
				},
				DashboardUID: "123456",
				PanelID:      12,
				NoDataState:  "NoData",
				ExecErrState: "Error",
				For:          60,
				Annotations: map[string]string{
					"Annotation1": "annotation",
					"Annotation2": "annotation",
				},
				Labels: map[string]string{
					"Label":  "test",
					"Label2": "test",
				},
				IsPaused: false,
			},
		},
	}

	d, err := Marshall(ResourceBody{
		Type: "grafana_rule_group",
		Name: "rule_group",
		Body: &ruleGroup,
	})
	require.NoError(t, err)
	require.Empty(t, string(d))
}

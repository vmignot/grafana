package hcl

import (
	"fmt"

	"github.com/hashicorp/hcl/v2/gohcl"
	"github.com/hashicorp/hcl/v2/hclwrite"

	"github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
)

type ResourceBody struct {
	Type string      `hcl:"type,label"`
	Name string      `hcl:"name,label"`
	Body interface{} `hcl:",body"`
}

func Marshall(resources ...ResourceBody) (data []byte, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("failed to marshal to HCL: %v", r)
		}
	}()
	f := hclwrite.NewEmptyFile()

	for _, resource := range resources {
		blk := gohcl.EncodeAsBlock(resource.Body, "resource")
		blk.SetLabels([]string{resource.Type, resource.Name})
		f.Body().AppendBlock(blk)
	}
	return f.Bytes(), nil
}

func MarshalAlertingFileExport(ex definitions.AlertingFileExport) (data []byte, err error) {
	resources := make([]ResourceBody, 0, len(ex.Groups)+len(ex.ContactPoints)+len(ex.Policies))
	for idx, group := range ex.Groups {
		gr := group
		resources = append(resources, ResourceBody{
			Type: "grafana_rule_group",
			Name: fmt.Sprintf("rule_group_%d", idx),
			Body: &gr,
		})
	}
	// for idx, cp := range ex.ContactPoints {
	// 	resources = append(resources, ResourceBody{
	// 		Type: "grafana_contact_point",
	// 		Name: fmt.Sprintf("contact_point_%d", idx),
	// 		Body: &cp,
	// 	})
	// }
	// for idx, cp := range ex.Policies {
	// 	resources = append(resources, ResourceBody{
	// 		Type: "grafana_notification_policy",
	// 		Name: fmt.Sprintf("notification_policy_%d", idx),
	// 		Body: &cp,
	// 	})
	// }
	return Marshall(resources...)
}

package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

type State struct {
	AlertState          *prometheus.GaugeVec
	StateUpdateDuration prometheus.Histogram

	// SaveDuration is the total time (in seconds) taken to save the alert instances
	// for an evaluation to the database.
	SaveDuration *prometheus.HistogramVec
}

func NewStateMetrics(r prometheus.Registerer) *State {
	return &State{
		AlertState: promauto.With(r).NewGaugeVec(prometheus.GaugeOpts{
			Namespace: Namespace,
			Subsystem: Subsystem,
			Name:      "alerts",
			Help:      "How many alerts by state.",
		}, []string{"state"}),
		StateUpdateDuration: promauto.With(r).NewHistogram(
			prometheus.HistogramOpts{
				Namespace: Namespace,
				Subsystem: Subsystem,
				Name:      "state_calculation_duration_seconds",
				Help:      "The duration of calculation of a single state.",
				Buckets:   []float64{0.01, 0.1, 1, 2, 5, 10},
			},
		),
		SaveDuration: promauto.With(r).NewHistogramVec(
			prometheus.HistogramOpts{
				Namespace: Namespace,
				Subsystem: Subsystem,
				Name:      "state_save_duration_seconds",
				Help:      "The total time taken to save the alert instances to the database.",
				Buckets:   []float64{1, 5, 10, 15, 30, 60, 120, 240},
			},
			[]string{"org"},
		),
	}
}

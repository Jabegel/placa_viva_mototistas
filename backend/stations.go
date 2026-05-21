package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Station struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Brand string `json:"brand"`
}

// GET /stations?city=brasilia
func getStations(c *gin.Context) {
	city := c.Query("city")

	stationsByCity := map[string][]Station{
		"brasilia": {
			{ID: "posto-103-sul", Name: "Posto 103 Sul", Brand: "Petrobras"},
			{ID: "posto-203-norte", Name: "Posto 203 Norte", Brand: "Petrobras"},
			{ID: "posto-214-sul", Name: "Posto 214 Sul", Brand: "Petrobras"},
		},
		"taguatinga": {
			{ID: "posto-taguatinga-1", Name: "Posto Centro Taguatinga", Brand: "Shell"},
			{ID: "posto-taguatinga-2", Name: "Posto Sul Taguatinga", Brand: "Ipiranga"},
		},
		"goiania": {
			{ID: "posto-goiania-1", Name: "Posto Setor Bueno", Brand: "Petrobras"},
			{ID: "posto-goiania-2", Name: "Posto Jardim Goiás", Brand: "Shell"},
		},
	}

	stations, ok := stationsByCity[city]
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cidade não encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"stations": stations})
}

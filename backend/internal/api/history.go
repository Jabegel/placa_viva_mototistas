package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
 )

type FuelingRecord struct {
	ID          int     `json:"id"`
	Date        string  `json:"date"`
	StationName string  `json:"station_name"`
	FuelType    string  `json:"fuel_type"`
	Liters      float64 `json:"liters"`
	Savings     float64 `json:"savings"`
}

func GetHistory(c *gin.Context) {
	// MOCK: Dados simulados de abastecimentos recentes
	history := []FuelingRecord{
		{ID: 1, Date: "20/03/2026", StationName: "Posto 214 Sul", FuelType: "Diesel S-10", Liters: 50.0, Savings: 15.00},
		{ID: 2, Date: "18/03/2026", StationName: "Posto Shell EPTG", FuelType: "Diesel S-10", Liters: 45.0, Savings: 13.50},
		{ID: 3, Date: "15/03/2026", StationName: "Posto BR Eixo", FuelType: "Diesel S-10", Liters: 60.0, Savings: 18.00},
		{ID: 4, Date: "12/03/2026", StationName: "Posto 214 Sul", FuelType: "Diesel S-10", Liters: 40.0, Savings: 12.00},
	}

	c.JSON(http.StatusOK, history )
}
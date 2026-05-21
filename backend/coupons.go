package main

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

// Em produção: salvar no banco de dados associado ao usuário
var (
	userPlates   = make(map[string]string) // phone -> plate
	platesMu     sync.Mutex
)

type SavePlateRequest struct {
	Phone string `json:"phone" binding:"required"`
	Plate string `json:"plate" binding:"required"`
}

// PUT /user/plate
func savePlate(c *gin.Context) {
	var req SavePlateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Valida formato básico da placa (ABC-1234 ou ABC-1D23 Mercosul)
	plate := req.Plate
	if len(plate) < 7 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Placa inválida"})
		return
	}

	platesMu.Lock()
	userPlates[req.Phone] = plate
	platesMu.Unlock()

	c.JSON(http.StatusOK, gin.H{
		"message": "Placa cadastrada com sucesso",
		"plate":   plate,
	})
}

// GET /user/plate?phone=+5511...
func getPlate(c *gin.Context) {
	phone := c.Query("phone")

	platesMu.Lock()
	plate, ok := userPlates[phone]
	platesMu.Unlock()

	if !ok {
		c.JSON(http.StatusOK, gin.H{"plate": ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{"plate": plate})
}

// GET /coupons?station=posto-214-sul
func getCoupons(c *gin.Context) {
	station := c.Query("station")
	_ = station // Em produção: filtrar por posto

	coupons := []map[string]interface{}{
		{
			"id":          "1",
			"fuelType":    "Gasolina",
			"fuelSubtype": "Comum",
			"price":       6.07,
			"tag":         "Mais vantajoso que etanol hoje",
			"color":       "#c8a832",
		},
		{
			"id":          "2",
			"fuelType":    "Etanol",
			"fuelSubtype": "Comum",
			"price":       4.70,
			"color":       "#4a7c3f",
		},
		{
			"id":          "3",
			"fuelType":    "Gasolina",
			"fuelSubtype": "Aditivada",
			"price":       6.20,
			"color":       "#2d6a8a",
		},
	}

	c.JSON(http.StatusOK, gin.H{"coupons": coupons})
}

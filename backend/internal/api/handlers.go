package api

import (
	"backend/internal/model"
	"net/http"
	"github.com/gin-gonic/gin"
)

var users = map[string]model.UserProfile{
	"61995824994": {
		ID: 1, Name: "João Motorista", Phone: "61995824994", Email: "joao@email.com",
		Vehicles: []model.Vehicle{{Name: "Nivus", Plate: "ABC1D23", FuelType: "Gasolina Comum"}},
	},
}

func Login(c *gin.Context) {
	var req struct{ Phone string `json:"phone"` }
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Telefone obrigatório"})
		return
	}

	user, exists := users[req.Phone]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"message": "Usuário não encontrado"})
		return
	}
	user.Token = "mock-token"
	c.JSON(200, user)
}

func Register(c *gin.Context) {
	var newUser model.UserProfile
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	users[newUser.Phone] = newUser
	newUser.Token = "mock-token-new"
	c.JSON(201, newUser)
}

func GetHistory(c *gin.Context) {
	history := []model.Fueling{
		{ID: 1, Date: "2026-05-10", StationName: "Posto 214 Sul", FuelType: "Gasolina", Liters: 40, AmountPaid: 230.0, Savings: 12.0},
		{ID: 2, Date: "2026-05-05", StationName: "Posto BR EPTG", FuelType: "Gasolina", Liters: 35, AmountPaid: 205.0, Savings: 10.5},
	}
	c.JSON(200, history)
}

func GetDashboard(c *gin.Context) {
	c.JSON(200, gin.H{
		"monthly_savings": 185.50,
		"total_liters": 450,
		"reward_progress": 0.75,
		"reward_text": "Faltam 50L para sua Ducha Grátis!",
	})
}

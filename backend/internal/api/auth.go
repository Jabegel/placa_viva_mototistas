package api

import (
	"backend/internal/model"
	"net/http"
	"github.com/gin-gonic/gin"
 )

type LoginRequest struct {
	Phone string `json:"phone" binding:"required"`
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Telefone é obrigatório"} )
		return
	}

	// MOCK: Se o DDD for 61, é Caminhoneiro. Senão, Motorista de App.
	user := model.UserProfile{
		ID:    1,
		Name:  "João Motorista",
		Token: "mock-jwt-token-12345",
	}

	if len(req.Phone) >= 2 && req.Phone[:2] == "61" {
		user.Type = "Caminhoneiro"
	} else {
		user.Type = "Motorista de App"
	}

	c.JSON(http.StatusOK, user )
}

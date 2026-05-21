package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// Em produção, usar Redis ou banco de dados
var (
	codStore = make(map[string]otpEntry)
	mu       sync.Mutex
)

type otpEntry struct {
	Code      string
	ExpiresAt time.Time
}

type SendCodeRequest struct {
	Phone string `json:"phone" binding:"required"`
}

type VerifyCodeRequest struct {
	Phone string `json:"phone" binding:"required"`
	Code  string `json:"code" binding:"required"`
}

// POST /auth/send-code
func sendCode(c *gin.Context) {
	var req SendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Número de telefone inválido"})
		return
	}

	// Gera código de 6 dígitos
	code := fmt.Sprintf("%06d", rand.Intn(1000000))
	expiresAt := time.Now().Add(5 * time.Minute)

	mu.Lock()
	codStore[req.Phone] = otpEntry{Code: code, ExpiresAt: expiresAt}
	mu.Unlock()

	// Em produção: integrar com Twilio, WhatsApp Business API, etc.
	// Por ora, loga o código para desenvolvimento
	fmt.Printf("[DEV] Código para %s: %s\n", req.Phone, code)

	// Simula envio via WhatsApp
	err := sendWhatsAppCode(req.Phone, code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao enviar código"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Código enviado via WhatsApp",
		"phone":   maskPhone(req.Phone),
	})
}

// POST /auth/verify-code
func verifyCode(c *gin.Context) {
	var req VerifyCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	mu.Lock()
	entry, exists := codStore[req.Phone]
	mu.Unlock()

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Código não encontrado"})
		return
	}

	if time.Now().After(entry.ExpiresAt) {
		mu.Lock()
		delete(codStore, req.Phone)
		mu.Unlock()
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Código expirado"})
		return
	}

	if entry.Code != req.Code {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Código incorreto"})
		return
	}

	// Limpa o código após uso
	mu.Lock()
	delete(codStore, req.Phone)
	mu.Unlock()

	// Gera token JWT (simplificado — use jwt-go em produção)
	token := generateToken(req.Phone)

	c.JSON(http.StatusOK, gin.H{
		"message": "Autenticado com sucesso",
		"token":   token,
	})
}

// Stub para integração WhatsApp — substituir por API real
func sendWhatsAppCode(phone, code string) error {
	// Exemplo com Twilio:
	// client := twilio.NewRestClient()
	// params := &twilioApi.CreateMessageParams{}
	// params.SetFrom("whatsapp:+14155238886")
	// params.SetTo("whatsapp:" + phone)
	// params.SetBody(fmt.Sprintf("Seu código Placa Viva: %s", code))
	// _, err := client.Api.CreateMessage(params)
	// return err
	fmt.Printf("[WhatsApp Stub] Enviando código %s para %s\n", code, phone)
	return nil
}

// Mascara o telefone: +55119****1234
func maskPhone(phone string) string {
	if len(phone) < 8 {
		return phone
	}
	return phone[:4] + "****" + phone[len(phone)-4:]
}

// Token simples para dev — use JWT em produção
func generateToken(phone string) string {
	return fmt.Sprintf("token_%s_%d", phone, time.Now().Unix())
}

// controllers/books.go

package users

import (
	"net/http"

	"socialinept/princessplatelets/server/models"

	"github.com/gin-gonic/gin"
)

// GET /books
// Get all books
func FindBooks(c *gin.Context) {
	var books []models.User
	models.DB.Find(&books)

	c.JSON(http.StatusOK, gin.H{"data": books})
}

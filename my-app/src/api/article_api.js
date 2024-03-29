import axios from "axios";
import apiConfig from "./apiConfig";
import TokenAPI from "./token";


const cleanUpData = (originalData) => {
    const cleanedData = {
        title: originalData.meta_data.title,
        keywords: originalData.meta_data.keywords,
        references: originalData.meta_data.references.map((ref) => ref.raw_text),
        abstract: originalData.meta_data.abstract,
        authors: originalData.meta_data.authors.map((author) => author.name),
        institutions: originalData.meta_data.institutions.map(
            (institution) => institution.name
        ),
        date: originalData.meta_data.pub_date,
        url: "go.com",
        id: originalData.id,
    };

    return cleanedData;
};


class ArticleAPI {

    static async handleUpload(url) {
        try {
            // Envoyer l'URL au backend Django pour le traitement en utilisant une requête GET
            const response = await axios.get(`${apiConfig.baseUrl}${apiConfig.uploadDrive}`, {
                params: { url },
            });

            // Afficher un message de succès ou faire d'autres actions nécessaires
            console.log('Upload réussi!', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'upload', error);
            // Gérer les erreurs et afficher un message à l'utilisateur si nécessaire
        }
    };

    static async fetchArticles() {
        try {
            const response = await fetch(
                `${apiConfig.baseUrl}${apiConfig.articlesEndpoint}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch articles");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    static async fetchArticle(currentPage, cleanIt) {
        try {
            const response = await axios.get(
                `${apiConfig.baseUrl}${apiConfig.articleEndpoint}${currentPage}`
            );
            if (response.status !== 200) {
                throw new Error("Failed to fetch article");
            }

            const data = response.data;
            if (cleanIt) return cleanUpData(data);
            return data;
        } catch (error) {
            console.error("Error fetching article:", error);
            throw error;
        }
    }


    static async deleteArticle(currentPage) {
        try {
            const response = await axios.delete(
                `${apiConfig.baseUrl}${apiConfig.deleteArticleEndPoint}${currentPage}`
            );
            if (response.status != 301) {
                console.log(response.status);

            }

        } catch (error) {
            console.error("Error deleting article:", error);
            throw error;
        }
    }
    static async validateArticle(currentPage) {
        try {
            const response = await axios.delete(
                `${apiConfig.baseUrl}${apiConfig.validateArticleEndPoint}${currentPage}`
            );
            if (response.status != 200) {
                console.log(response.status);

            }

        } catch (error) {
            console.error("Error validating article:", error);
            throw error;
        }
    }
    static async updateArticle(currentPage, meta_data) {
        console.log("link : " + `${apiConfig.baseUrl}${apiConfig.updateArticleEndPoint}${currentPage}` + '/');
        try {
            const response = await axios.put(
                `${apiConfig.baseUrl}${apiConfig.updateArticleEndPoint}${currentPage}/`,
                { 'meta_data': meta_data }
            );
            if (response.status != 200) {
                console.log(response.status);

            }

        } catch (error) {
            console.error("Error Updating article:", error);
            throw error;
        }
    }
    static async fetchPdfData(pdfId) {
        try {
            const response = await axios.get(
                `${apiConfig.baseUrl}${apiConfig.pdfEndpoint}${pdfId}/`,
                {
                    responseType: "arraybuffer",
                }
            );

            const data = new Blob([response.data]);

            const dataUrl = URL.createObjectURL(data);

            return dataUrl;
        } catch (error) {
            console.error("Error fetching PDF:", error);
            throw error;
        }
    }
    static async add_favorite(articleId) {
        const tokenValue = await TokenAPI.getCookie('token');
        try {

            const response = await axios.post(
                `${apiConfig.baseUrl}${apiConfig.addFavorite}${articleId}/`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${tokenValue}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des favoris');
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des favoris:', error);
            throw error;
        }
    }
    static async remove_favorite(articleId) {
        const tokenValue = await TokenAPI.getCookie('token');
        try {
            const response = await axios.delete(
                `${apiConfig.baseUrl}${apiConfig.removeFavorite}${articleId}/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${tokenValue}`,  // Include your authentication token if required
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des favoris');
            }

            const data = await response.json();

            return data;

        } catch (error) {
            console.error('Erreur lors de la récupération des favoris:', error);
            throw error;
        }
    }
    static async getFavoriteArticles() {
        const tokenValue = await TokenAPI.getCookie('token');
        try {
            const response = await fetch(`${apiConfig.baseUrl}${apiConfig.getFavoritesEndPoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + tokenValue,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des favoris');
            }

            const data = await response.json();

            if (data.favorites.length > 0) {
                const articles = data.favorites.map((favorite, index) => ({
                    date: "12/12/2023",
                    title: favorite.meta_data.title,
                    authors: favorite.meta_data.authors[0]?.name ? favorite.meta_data.authors.map((author) => author.name).join(", ") : "",
                    institutions: favorite.meta_data.institutions[0]?.name ? favorite.meta_data.institutions.map((institution) => institution.name).join(", ") : "",
                    url: "http://ictinnovations.org/2010",
                    fav: "0",
                }));

                return articles;
            } else {
                throw new Error("Aucune favori trouvée");
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des favoris:', error);
            throw error;
        }
    }
}

export default ArticleAPI;

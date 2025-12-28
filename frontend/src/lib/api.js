/**
 * API service layer for communicating with the backend.
 * Uses Fetch API for simplicity.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, config)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.detail || `HTTP error! status: ${response.status}`)
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null
        }

        return await response.json()
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

/**
 * Project API endpoints
 */
export const projectAPI = {
    /**
     * Get paginated list of projects
     */
    async getProjects({ page = 1, pageSize = 20, klasterRegional, tahunRkap, statusIssue } = {}) {
        const params = new URLSearchParams()
        params.append('page', page)
        params.append('page_size', pageSize)
        if (klasterRegional) params.append('klaster_regional', klasterRegional)
        if (tahunRkap) params.append('tahun_rkap', tahunRkap)
        if (statusIssue) params.append('status_issue', statusIssue)

        return fetchAPI(`/projects?${params.toString()}`)
    },

    /**
     * Get single project by ID
     */
    async getProject(idRoot) {
        return fetchAPI(`/projects/${idRoot}`)
    },

    /**
     * Create new project
     */
    async createProject(data) {
        return fetchAPI('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    /**
     * Update project (full update)
     */
    async updateProject(idRoot, data) {
        return fetchAPI(`/projects/${idRoot}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    },

    /**
     * Update project progress
     */
    async updateProgress(idRoot, data) {
        return fetchAPI(`/projects/${idRoot}/progress`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    /**
     * Update project issue
     */
    async updateIssue(idRoot, data) {
        return fetchAPI(`/projects/${idRoot}/issue`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    },

    /**
     * Delete project
     */
    async deleteProject(idRoot) {
        return fetchAPI(`/projects/${idRoot}`, {
            method: 'DELETE',
        })
    },

    /**
     * Get summary statistics
     */
    async getStats(tahunRkap) {
        const params = new URLSearchParams()
        if (tahunRkap) params.append('tahun_rkap', tahunRkap)
        return fetchAPI(`/projects/stats?${params.toString()}`)
    },
}

export default projectAPI

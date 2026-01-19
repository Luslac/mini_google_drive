import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/application/app.js';
import { prisma } from '../src/application/database.js';
import { deleteAllTestingTableData } from './utils-test.js';

afterAll(async () => {
    await prisma.$disconnect()
})

// Helper function untuk register & login
const registerAndLogin = async () => {
    await request(app)
        .post('/users/register')
        .send({
            email: "test1111@test.com",
            password: "test1234",
            name: "testinger"
        })
    
    const loginResponse = await request(app)
        .post('/users/login')
        .send({
            email: "test1111@test.com",
            password: "test1234"
        })
    
    return loginResponse.body.data.token
}

// Helper function untuk create folder
const createFolder = async (token, folderData) => {
    return await request(app)
        .post('/users/folders/create')
        .set('Authorization', `Bearer ${token}`)
        .send(folderData)
}

describe('POST /users/folders/create', () => {
    beforeEach(async () => {
        await deleteAllTestingTableData()
    })

    it('Should Create Folder Successfully', async () => {
        const token = await registerAndLogin()
        
        const response = await request(app)
            .post('/users/folders/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "folder testing",
                parentId: null
            })

        expect(response.status).toBe(201)
        expect(response.body.data.name).toBe("folder testing")
        expect(response.body.data.parentId).toBeNull()
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('userId')
    })

    it('Should Create Subfolder Successfully', async () => {
        const token = await registerAndLogin()
        
        // Create parent folder
        const parentFolder = await createFolder(token, {
            name: "Parent Folder",
            parentId: null
        })

        // Create subfolder
        const response = await request(app)
            .post('/users/folders/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Subfolder",
                parentId: parentFolder.body.data.id
            })

        expect(response.status).toBe(201)
        expect(response.body.data.name).toBe("Subfolder")
        expect(response.body.data.parentId).toBe(parentFolder.body.data.id)
    })

    it('Should Fail When Name Is Empty', async () => {
        const token = await registerAndLogin()
        
        const response = await request(app)
            .post('/users/folders/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "",
                parentId: null
            })

        expect(response.status).toBe(400)
    })

    it('Should Fail When Token Is Missing', async () => {
        const response = await request(app)
            .post('/users/folders/create')
            .send({
                name: "folder testing",
                parentId: null
            })

        expect(response.status).toBe(401)
    })

    it('Should Fail When Token Is Invalid', async () => {
        const response = await request(app)
            .post('/users/folders/create')
            .set('Authorization', 'Bearer invalid_token')
            .send({
                name: "folder testing",
                parentId: null
            })

        expect(response.status).toBe(401)
    })
})

describe('GET /users/folders/:id', () => {
    beforeEach(async () => {
        await deleteAllTestingTableData()
    })

    it('Should Get Folder Successfully', async () => {
        const token = await registerAndLogin()
        
        // Create folder
        const createdFolder = await createFolder(token, {
            name: "folder testing",
            parentId: null
        })

        // Get folder
        const response = await request(app)
            .get(`/users/folders/${createdFolder.body.data.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data.id).toBe(createdFolder.body.data.id)
        expect(response.body.data.name).toBe("folder testing")
    })

    it('Should Fail When Folder Not Found', async () => {
        const token = await registerAndLogin()
        
        const response = await request(app)
            .get('/users/folders/999999')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404)
    })

    it('Should Fail When Token Is Missing', async () => {
        const response = await request(app)
            .get('/users/folders/1')

        expect(response.status).toBe(401)
    })

    it('Should Fail When Accessing Other User Folder', async () => {
        // User 1 creates folder
        const token1 = await registerAndLogin()
        const folder = await createFolder(token1, {
            name: "User 1 Folder",
            parentId: null
        })

        // User 2 tries to access
        await request(app)
            .post('/users/register')
            .send({
                email: "user2@test.com",
                password: "test1234",
                name: "User 2"
            })
        
        const login2 = await request(app)
            .post('/users/login')
            .send({
                email: "user2@test.com",
                password: "test1234"
            })

        const response = await request(app)
            .get(`/users/folders/${folder.body.data.id}`)
            .set('Authorization', `Bearer ${login2.body.data.token}`)
            console.log(response.body)
            console.log(folder.body.data)
        expect(response.status).toBe(403) 
    })
})

describe('DELETE /users/folders/:id', () => {
    beforeEach(async () => {
        await deleteAllTestingTableData()
    })

    it('Should Delete Folder Successfully', async () => {
        const token = await registerAndLogin()
        
        const folder = await createFolder(token, {
            name: "Folder to Delete",
            parentId: null
        })

        const response = await request(app)
            .delete(`/users/folders/${folder.body.data.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)


        // Verify folder is deleted
        const checkFolder = await request(app)
            .get(`/users/folders/${folder.body.data.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(checkFolder.status).toBe(404)
    })

    it('Should Delete Folder and Return Deleted Data', async () => {
        const token = await registerAndLogin()
        
        const folder = await createFolder(token, {
            name: "Folder to Delete",
            parentId: null
        })

        const response = await request(app)
            .delete(`/users/folders/${folder.body.data.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty('id', folder.body.data.id)
    })

    it('Should Fail When Folder Not Found', async () => {
        const token = await registerAndLogin()
        
        const response = await request(app)
            .delete('/users/folders/999999')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404)
    })

    it('Should Fail When Token Is Missing', async () => {
        const response = await request(app)
            .delete('/users/folders/1')

        expect(response.status).toBe(401)
    })

    it('Should Fail When Deleting Other User Folder', async () => {
        // User 1 creates folder
        const token1 = await registerAndLogin()
        const folder = await createFolder(token1, {
            name: "User 1 Folder",
            parentId: null
        })

        // User 2 tries to delete
        await request(app)
            .post('/users/register')
            .send({
                email: "user2@test.com",
                password: "test1234",
                name: "User 2"
            })
        
        const login2 = await request(app)
            .post('/users/login')
            .send({
                email: "user2@test.com",
                password: "test1234"
            })

        const response = await request(app)
            .delete(`/users/folders/${folder.body.data.id}`)
            .set('Authorization', `Bearer ${login2.body.data.token}`)

        expect(response.status).toBe(403)
    })

    it('Should Delete Folder With Subfolders (Cascade)', async () => {
        const token = await registerAndLogin()
        
        // Create parent folder
        const parentFolder = await createFolder(token, {
            name: "Parent Folder",
            parentId: null
        })

        // Create subfolder
        await createFolder(token, {
            name: "Subfolder",
            parentId: parentFolder.body.data.id
        })

        // Delete parent folder (should cascade to subfolder)
        const response = await request(app)
            .delete(`/users/folders/${parentFolder.body.data.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)

        // Verify both folders are deleted
        const folderCount = await prisma.folder.count()
        expect(folderCount).toBe(0)
    })
})


describe('Integration Tests - Folder Workflow', () => {
    beforeEach(async () => {
        await deleteAllTestingTableData()
    })

    it('Should Complete Full Folder Lifecycle', async () => {
        const token = await registerAndLogin()
        
        // 1. Create folder
        const createResponse = await createFolder(token, {
            name: "Project Folder",
            parentId: null
        })
        expect(createResponse.status).toBe(201)
        const folderId = createResponse.body.data.id

        // 2. Get folder
        const getResponse = await request(app)
            .get(`/users/folders/${folderId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(getResponse.status).toBe(200)
        expect(getResponse.body.data.name).toBe("Project Folder")

        // 3. List files (empty)
        const listResponse = await request(app)
            .get(`/users/folders/${folderId}/file-list`)
            .set('Authorization', `Bearer ${token}`)
        expect(listResponse.status).toBe(200)
        expect(listResponse.body.data.files).toBeUndefined()

        // 4. Delete folder
        const deleteResponse = await request(app)
            .delete(`/users/folders/${folderId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(deleteResponse.status).toBe(200)

        // 5. Verify deletion
        const verifyResponse = await request(app)
            .get(`/users/folders/${folderId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(verifyResponse.status).toBe(404)
    })
    it('Should Handle Nested Folder Structure', async () => {
        const token = await registerAndLogin()
        
        // Create root folder
        const root = await createFolder(token, {
            name: "Root",
            parentId: null
        })

        // Create level 1 subfolder
        const level1 = await createFolder(token, {
            name: "Level 1",
            parentId: root.body.data.id
        })

        // Create level 2 subfolder
        const level2 = await createFolder(token, {
            name: "Level 2",
            parentId: level1.body.data.id
        })

        expect(level2.status).toBe(201)
        expect(level2.body.data.parentId).toBe(level1.body.data.id)

        // Verify structure
        const getLevel2 = await request(app)
            .get(`/users/folders/${level2.body.data.id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(getLevel2.status).toBe(200)
        expect(getLevel2.body.data.name).toBe("Level 2") })
})

/*class CollisionGrid {
    constructor(width, height, gridSize = 100) {
        this.totalInstances = [];
        this.grid = [];
        this.outOfBoundObjects = [];
        this.width = width;
        this.height = height;
        this.gridSize = gridSize;
    }
    intoCells() {
        for (let i = 0; i < this.gridSize; i++) {
            let row = [];
            for (let j = 0; j < this.gridSize; j++) row.push([]);
            this.grid.push(row);
        }
        this.grid;
    }
    addToGrid(instance) {
        let toAdd = {
            x: instance.x,
            y: instance.y,
            vx: instance.vx,
            vy: instance.vy,
            size: instance.size,
            id: instance.id
        };
        let cellX = Math.floor(toAdd.x * this.gridSize / this.height);
        let cellY = Math.floor(toAdd.y * this.gridSize / this.height);
        this.totalInstances.push(instance);
        if (!this.grid[cellY]) return this.outOfBoundObjects.push(toAdd);
        if (!this.grid[cellY][cellX]) return this.outOfBoundObjects.push(toAdd);
        this.grid[cellY][cellX].push(toAdd);
    }
    getCell(instance) {
        let cellX = Math.floor(instance.x * this.gridSize / this.height);
        let cellY = Math.floor(instance.y * this.gridSize / this.height);
        if (!this.grid[cellY]) return this.outOfBoundObjects;
        if (!this.grid[cellY][cellX]) return this.outOfBoundObjects;
        return this.grid[cellY][cellX];
    }
    reset(list) {
        this.totalInstances = [];
        this.grid = [];
        this.outOfBoundObjects = [];
        this.intoCells();
        for (let i = 0; i < list.length; i++) this.addToGrid(list[i]);
    }
    hitDetection(instance, other) {
        return Math.sqrt(Math.pow(other.x - instance.x, 2) + Math.pow(other.y - instance.y, 2)) < (instance.size + other.size);
    }
    queryForCollisionPairs() {
        let pairs = [];
        let i = 0;
        for (let i = 0; i < this.totalInstances.length; i++) {
            let instance = this.totalInstances[i];
            let cell = this.getCell(instance);
            if (cell.length > 1) {
                for (let j = 0; j < cell.length; j++) {
                    let other = cell[j];
                    let pair = instance.id > other.id ? [other.id, instance.id] : [instance.id, other.id];
                    let hit = this.hitDetection(instance, other);
                    if (!pairs.includes(pair) && hit && instance.id !== other.id) pairs.push(pair);
                }
            }
        }
        return pairs;
    }
};
module.exports = CollisionGrid;*/

class QuadTree {
    constructor(bounds, max_objects, max_levels, level) {
        this.maxObjects = max_objects || 6;
        this.maxLevels = max_levels || 6;
        this.level = level || 0;
        this.bounds = bounds;
        this.objects = [];
        this.branches = [];
    }
    split() {
        let nextLevel = this.level + 1;
        let subWidth = this.bounds.width / 2;
        let subHeight = this.bounds.height / 2;
        let x = this.bounds.x;
        let y = this.bounds.y;
        this.branches[0] = (new QuadTree({
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel));
        this.branches[1] = (new QuadTree({
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel));
        this.branches[2] = (new QuadTree({
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel));
        this.branches[3] = (new QuadTree({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel));
    }
    getBranches(object) {
        if (!object._AABB) {
            return [];
        }
        let output = [];
        let midY = this.bounds.x + (this.bounds.width / 2);
        let midX = this.bounds.y + (this.bounds.height / 2);
        let north = object._AABB.y1 < midX;
        let west = object._AABB.x1 < midY;
        let east = object._AABB.x2 > midY;
        let south = object._AABB.y2 > midX;
        if (north && east) output.push(0);
        if (west && north) output.push(1);
        if (west && south) output.push(2);
        if (east && south) output.push(3);
        return output;
    }
    insert(object) {
        if (this.branches.length) {
            let cells = this.getBranches(object);
            for (let i = 0, l = cells.length; i < l; i++) {
                this.branches[cells[i]].insert(object);
            }
            return;
        }
        this.objects.push(object);
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.branches.length) this.split();
            for (let i = 0, l = this.objects.length; i < l; i ++) {
                let cells = this.getBranches(this.objects[i]);
                for (let j = 0; j < cells.length; j++) {
                    this.branches[cells[j]].insert(this.objects[i]);
                }
            }
            this.objects = [];
        }
    }
    retrieve(object) {
        let cells = this.getBranches(object);
        let output = this.objects;
        if (this.branches.length && cells.length) {
            for (let i = 0, l = cells.length; i < l; i++) {
                output = output.concat(this.branches[cells[i]].retrieve(object));
            }
        }
        output = output.filter(function(item, index) {
            return output.indexOf(item) >= index;
        });
        return output;
    }
    hitDetection(object, other) {
        if (
            object._AABB.x1 > other._AABB.x2 ||
            object._AABB.y1 > other._AABB.y2 ||
            object._AABB.x2 < other._AABB.x1 ||
            object._AABB.y2 < other._AABB.y1
        ) {
            return false;
        }
        return true;
    }
    queryForCollisionPairs(object) {
        let output = [],
            closeBy = this.retrieve(object);
        if (closeBy.length > 0) {
            for (let i = 0, l = closeBy.length; i < l; i ++) {
                if (closeBy[i].id === object.id) {
                    continue;
                }
                let other = closeBy[i],
                    hit = this.hitDetection(object, other);
                if (hit && output.indexOf(other) === -1) {
                    output.push(other);
                }
            }
        }
        return output;
    }
    clear() {
        this.objects = [];
        if (this.branches.length) {
            for (let i = 0; i < this.branches.length; i++) {
                this.branches[i].clear();
            }
            this.branches = [];
        }
    }
    getAABB(object) {
        let size = object.realSize || object.size,
            width = (object.width || 1) * size,
            height = (object.height || 1) * size;
        return {
            x1: object.x - width,
            y1: object.y - height,
            x2: object.x + width,
            y2: object.y + height
        };
    }
}

module.exports = QuadTree;

'use strict'

var ECS = require('..')
var tape = require('tape')


tape('Instantiation', function(t) {
	var ecs

	t.doesNotThrow(function() { ecs = new ECS() }, 'instantiation')

	t.ok(ecs, 'ecs created')

	t.end()
})


tape('Entities', function(t) {
	var ecs = new ECS()
	var id1, id2

	t.doesNotThrow(function() { id1 = ecs.createEntity() }, 'createEntity')
	t.doesNotThrow(function() { id2 = ecs.createEntity() }, 'createEntity')

	t.assert(id1 != id2, 'entity ids are different')
	t.assert(id1 !== id2, 'entity ids are different')

	t.doesNotThrow(function() { ecs.deleteEntity(id1, true) }, 'deleteEntity, immediate')
	t.doesNotThrow(function() { ecs.deleteEntity(id1, true) }, 'ok to delete non-existent entities')
	t.doesNotThrow(function() { ecs.deleteEntity(123, true) }, 'ok to delete non-existent entities')
	
	var comp = {name:'foo'}
	ecs.createComponent(comp)
	ecs.addComponent(id2, comp.name)
	t.doesNotThrow(function() { ecs.deleteEntity(id2) }, 'deleteEntity, deferred')
	t.assert( ecs.hasComponent(id2, comp.name), 'deferred removal not done yet' )
	t.doesNotThrow(function() { ecs.tick() }, 'tick with pending removal')
	t.false( ecs.hasComponent(id2, comp.name), 'deferred removal done' )
	
	var id3 = ecs.createEntity([comp.name])
	t.doesNotThrow(function() { ecs.deleteEntity(id3) }, 'deferred removal')
	t.doesNotThrow(function() { ecs.render() }, 'render with pending removal')
	t.false( ecs.hasComponent(id3, comp.name), 'deferred removal done' )
	
	var id4 = ecs.createEntity([comp.name])
	t.doesNotThrow(function() { ecs.deleteEntity(id4) }, 'deferred removal')
	setTimeout(function(){
		t.false( ecs.hasComponent(id4, comp.name), 'deferred removal done with timeout' )
	}, 10)
	
	t.end()
})


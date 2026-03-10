<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Review;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_create_pending_review_with_image()
    {
        $response = $this->postJson('/api/reviews', [
            'image_url' => 'http://example.com/foo.jpg',
            'pending' => true,
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reviews', [
            'image_url' => 'http://example.com/foo.jpg',
            'pending' => true,
            'text' => '',
            'stars' => 0,
        ]);
    }

    /** @test */
    public function can_update_review_and_clear_pending_flag()
    {
        $review = Review::create([
            'image_url' => 'http://example.com/foo.jpg',
            'pending' => true,
        ]);

        $response = $this->patchJson("/api/reviews/{$review->id}", [
            'text' => 'Nice picture',
            'stars' => 4,
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'text' => 'Nice picture',
            'stars' => 4,
            'pending' => false,
        ]);
    }
}

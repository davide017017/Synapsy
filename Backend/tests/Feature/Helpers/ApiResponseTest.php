<?php

namespace Tests\Feature\Helpers;

use Tests\TestCase;
use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;
use PHPUnit\Framework\Attributes\Test;

class ApiResponseTest extends TestCase
{
    // =========================================================================
    // ✅ SUCCESS RESPONSE - DEFAULT
    // =========================================================================

    #[Test]
    public function it_returns_success_response_with_default_values()
    {
        $response = ApiResponse::success();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals([
            'success' => true,
            'message' => 'OK',
            'data'    => null,
        ], $response->getData(true));
    }

    // =========================================================================
    // ✅ SUCCESS RESPONSE - CUSTOM MESSAGE & DATA
    // =========================================================================

    #[Test]
    public function it_returns_success_response_with_custom_message_and_data()
    {
        $response = ApiResponse::success('Tutto a posto', ['foo' => 'bar'], 201);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals([
            'success' => true,
            'message' => 'Tutto a posto',
            'data'    => ['foo' => 'bar'],
        ], $response->getData(true));
    }

    // =========================================================================
    // ❌ ERROR RESPONSE - DEFAULT
    // =========================================================================

    #[Test]
    public function it_returns_error_response_with_default_values()
    {
        $response = ApiResponse::error();

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals([
            'success' => false,
            'message' => 'Errore',
            'errors'  => null,
        ], $response->getData(true));
    }

    // =========================================================================
    // ❌ ERROR RESPONSE - CUSTOM MESSAGE & ERRORS
    // =========================================================================

    #[Test]
    public function it_returns_error_response_with_custom_message_and_errors()
    {
        $response = ApiResponse::error('Errore grave', ['campo' => 'obbligatorio'], 422);

        $this->assertEquals(422, $response->getStatusCode());
        $this->assertEquals([
            'success' => false,
            'message' => 'Errore grave',
            'errors'  => ['campo' => 'obbligatorio'],
        ], $response->getData(true));
    }
}


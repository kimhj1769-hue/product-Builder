import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: 'Hello! Tell me about yourself.',
        },
      ],
    });

    console.log('Claude의 응답:');
    console.log(message.content[0].type === 'text' ? message.content[0].text : 'Non-text response');
  } catch (error) {
    console.error('에러 발생:', error.message);
    process.exit(1);
  }
}

main();

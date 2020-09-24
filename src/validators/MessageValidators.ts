import { celebrate, Joi } from 'celebrate';

export class MessageValidator {

    public markAsProcessed = celebrate({
        params: Joi.object().keys({
            messageId: Joi.string().required(),
        }),
    });

    public receive = celebrate({
        query: Joi.object().keys({
            qty: Joi.number().min(1).optional().allow(null),
        }),
    });

    public send = celebrate({
        body: Joi.object().keys({
            message: Joi.string().required(),
            payload: Joi.any().optional().allow(null),
        }),
    });

}

export const messageValidator = new MessageValidator();
